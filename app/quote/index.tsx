import { useEffect, useState, type ComponentProps } from "react";
import { View, Text, TextInput, Pressable, Image, ScrollView, Linking, Alert, Platform, type TextInputProps } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@/app/theme/theme";
import { useT } from "@/app/i18n";
import { CLIENT } from "@/config/client";
import { supabase, TENANT_ID } from "@/app/lib/supabase";
import { Screen, Container, Card, SoftCard, PrimaryButton, GhostButton, Divider } from "@/app/theme/ui";

type IoniconName = ComponentProps<typeof Ionicons>["name"];

const DRAFT_KEY = "crx.quote.draft";

const SERVICES = [
  { id: "tint",     labelKey: "quote.serviceTint",     descKey: "quote.serviceTintDesc"     },
  { id: "audio",    labelKey: "quote.serviceAudio",    descKey: "quote.serviceAudioDesc"    },
  { id: "wrap",     labelKey: "quote.serviceWrap",     descKey: "quote.serviceWrapDesc"     },
  { id: "chrome",   labelKey: "quote.serviceChrome",   descKey: "quote.serviceChromeDesc"   },
  { id: "lighting", labelKey: "quote.serviceLighting", descKey: "quote.serviceLightingDesc" },
  { id: "wheels",   labelKey: "quote.serviceWheels",   descKey: "quote.serviceWheelsDesc"   },
];

const STEPS: { icon: IoniconName; titleKey: string }[] = [
  { icon: "grid-outline", titleKey: "quote.step1Title" },
  { icon: "car-outline", titleKey: "quote.step2Title" },
  { icon: "camera-outline", titleKey: "quote.step3Title" },
  { icon: "chatbubbles-outline", titleKey: "quote.step4Title" },
];

// 4-step quote wizard: pick service, enter vehicle info, attach photos, submit via WhatsApp + Supabase.
export default function QuoteScreen() {
  const { tokens } = useTheme();
  const { t } = useT();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [service, setService] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(DRAFT_KEY).then((raw) => {
      if (!raw) return;
      const d = JSON.parse(raw);
      if (d.step) setStep(d.step);
      if (d.service) setService(d.service);
      if (d.model) setModel(d.model);
      if (d.year) setYear(d.year);
      if (d.photos) setPhotos(d.photos);
      if (d.name) setName(d.name);
      if (d.phone) setPhone(d.phone);
    });
  }, []);

  useEffect(() => {
    const id = setTimeout(() => AsyncStorage.setItem(DRAFT_KEY, JSON.stringify({ step, service, model, year, photos, name, phone })), 250);
    return () => clearTimeout(id);
  }, [step, service, model, year, photos, name, phone]);

  // Returns whether the current step's required fields are filled in.
  const canNext = () => {
    if (step === 0) return !!service;
    if (step === 1) return model.trim().length >= 2 && year.trim().length >= 2;
    if (step === 2) return true;
    if (step === 3) return name.trim().length >= 2 && phone.trim().length >= 5;
    return false;
  };

  // Opens a browser file picker and resolves selected images as data URIs (web only).
  function pickPhotosWeb(): Promise<string[]> {
    return new Promise((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.multiple = true;
      input.onchange = () => {
        const files = input.files ? Array.from(input.files) : [];
        Promise.all(
          files.map(
            (file) =>
              new Promise<string>((res) => {
                const reader = new FileReader();
                reader.onload = () => res(reader.result as string);
                reader.readAsDataURL(file);
              })
          )
        ).then(resolve);
      };
      input.click();
    });
  }

  // Requests gallery permission and lets the user pick photos (native) or delegates to the web picker.
  async function pickPhotos() {
    if (Platform.OS === "web") {
      const uris = await pickPhotosWeb();
      setPhotos((prev) => Array.from(new Set([...prev, ...uris])).slice(0, 12));
      return;
    }
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) { Alert.alert(t("quote.permissionTitle"), t("quote.permissionMessage")); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"] as ImagePicker.MediaType[], quality: 0.85, allowsMultipleSelection: true, selectionLimit: 8 });
    if (!result.canceled) setPhotos((prev) => Array.from(new Set([...prev, ...result.assets.map((a) => a.uri)])).slice(0, 12));
  }

  // Saves the quote to Supabase, clears the local draft, and opens WhatsApp with a prefilled message.
  async function submit() {
    if (Platform.OS !== "web") Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const svc = SERVICES.find((s) => s.id === service)?.labelKey ?? service;
    const serviceLabel = t(svc);

    const { error } = await supabase.from("quotes").insert({
      tenant_id: TENANT_ID,
      service: serviceLabel,
      car_model: model.trim(),
      car_year: year.trim(),
      contact_name: name.trim(),
      contact_phone: phone.trim(),
      status: "pending",
    });
    if (error) console.warn("quote insert failed:", error.message);

    const photosLine = photos.length ? t("quote.waPhotosLine").replace("{count}", String(photos.length)) : "";
    const msg = t("quote.waTemplate")
      .replace("{service}", serviceLabel)
      .replace("{car}", `${model} (${year})`)
      .replace("{name}", name)
      .replace("{phone}", phone) + photosLine;
    await AsyncStorage.removeItem(DRAFT_KEY);
    Linking.openURL(`https://wa.me/${CLIENT.whatsappPhone}?text=${encodeURIComponent(msg)}`).catch(() => {});
  }

  // Renders a labeled text input field shared by the vehicle-info and contact steps.
  const field = (label: string, value: string, setter: (v: string) => void, ph: string, opts?: Partial<TextInputProps>) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, marginBottom: 6 }}>{label}</Text>
      <TextInput value={value} onChangeText={setter} placeholder={ph} placeholderTextColor={tokens.color.muted} {...opts}
        style={{ borderWidth: 1, borderColor: tokens.color.hairline, backgroundColor: tokens.color.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, color: tokens.color.ink, fontWeight: "700" }} />
    </View>
  );

  return (
    <Screen>
      <View style={{ paddingTop: Math.max(insets.top, 20) + 8, paddingHorizontal: tokens.space.xl, paddingBottom: tokens.space.md, borderBottomWidth: 1, borderBottomColor: tokens.color.hairline, backgroundColor: tokens.color.surface, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pressable onPress={() => { if (step === 0) router.back(); else { if (Platform.OS !== "web") Haptics.selectionAsync(); setStep((s) => s - 1); } }} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="chevron-back" size={22} color={tokens.color.ink} />
        </Pressable>
        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16 }}>{t("quote.title")}</Text>
        <Pressable onPress={() => router.back()} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <Ionicons name="close" size={20} color={tokens.color.muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          {/* Progress */}
          <SoftCard>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18 }}>{t("quote.hero")}</Text>
            <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 18 }}>{t("quote.heroSub")}</Text>
            <View style={{ flexDirection: "row", marginTop: tokens.space.md }}>
              {STEPS.map((s, i) => {
                const active = i === step; const done = i < step;
                return (
                  <View key={i} style={{ flex: 1, alignItems: "center" }}>
                    <View style={{ width: 34, height: 34, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: active || done ? `${tokens.color.accent}88` : tokens.color.hairline, backgroundColor: done ? tokens.color.accentSoft : tokens.color.surface }}>
                      <Ionicons name={done ? "checkmark" : s.icon} size={16} color={active || done ? tokens.color.accent : tokens.color.muted} />
                    </View>
                    <Text numberOfLines={1} style={{ color: active ? tokens.color.ink : tokens.color.muted, fontSize: 10, fontWeight: "900", marginTop: 6, maxWidth: 68 }}>{t(s.titleKey)}</Text>
                  </View>
                );
              })}
            </View>
          </SoftCard>

          <Divider style={{ marginTop: tokens.space.lg }} />

          <View style={{ marginTop: tokens.space.lg }}>
            {step === 0 && (
              <View style={{ gap: 10 }}>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 4 }}>{t("quote.pickService")}</Text>
                {SERVICES.map((svc) => (
                  <Pressable key={svc.id} onPress={() => setService(svc.id)}>
                    {({ pressed }) => (
                      <Card style={{ borderColor: service === svc.id ? `${tokens.color.accent}99` : tokens.color.hairline, backgroundColor: service === svc.id ? tokens.color.accentSoft : tokens.color.surface, opacity: pressed ? 0.9 : 1 }}>
                        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14 }}>{t(svc.labelKey)}</Text>
                        <Text style={{ color: tokens.color.muted, fontSize: 12, marginTop: 6, lineHeight: 16 }}>{t(svc.descKey)}</Text>
                      </Card>
                    )}
                  </Pressable>
                ))}
              </View>
            )}

            {step === 1 && (
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 16 }}>{t("quote.vehicleInfo")}</Text>
                {field(t("quote.model"), model, setModel, t("quote.modelPh"))}
                {field(t("quote.year"), year, setYear, t("quote.yearPh"), { keyboardType: "number-pad" })}
              </View>
            )}

            {step === 2 && (
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 16 }}>{t("quote.photos")}</Text>
                <Card>
                  <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 16 }}>Adicione fotos do seu carro para um orçamento mais preciso.</Text>
                  <View style={{ marginTop: 12 }}><PrimaryButton label="Adicionar fotos" onPress={pickPhotos} /></View>
                  {photos.length > 0 && (
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                      {photos.map((uri) => (
                        <View key={uri} style={{ width: 88, height: 88, borderRadius: 14, overflow: "hidden" }}>
                          <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
                          <Pressable onPress={() => setPhotos((p) => p.filter((x) => x !== uri))} style={{ position: "absolute", top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.55)", alignItems: "center", justifyContent: "center" }}>
                            <Ionicons name="close" size={14} color="#fff" />
                          </Pressable>
                        </View>
                      ))}
                    </View>
                  )}
                </Card>
              </View>
            )}

            {step === 3 && (
              <View>
                <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, marginBottom: 16 }}>{t("quote.contact")}</Text>
                {field(t("quote.name"), name, setName, t("quote.namePh"))}
                {field(t("quote.phone"), phone, setPhone, t("quote.phonePh"), { keyboardType: "phone-pad" })}
                <View style={{ marginTop: 8 }}><PrimaryButton label={t("quote.sendWhatsApp")} onPress={submit} disabled={!canNext()} /></View>
              </View>
            )}
          </View>

          <View style={{ marginTop: tokens.space.xl }}>
            {step < 3 ? (
              <PrimaryButton label={t("common.continue")} onPress={() => { if (canNext()) { if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); setStep((s) => s + 1); } }} disabled={!canNext()} />
            ) : (
              <GhostButton label={t("common.done")} onPress={() => router.back()} />
            )}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}
