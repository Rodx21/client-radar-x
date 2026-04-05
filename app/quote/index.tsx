import React, { useMemo, useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, TextInput, Linking, Image, Alert, KeyboardTypeOptions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useTheme } from "../theme/theme";
import { useT } from "../i18n";
import { Screen, Container, Card, SoftCard, PrimaryButton, GhostButton, Divider } from "../theme/ui";
import { clearQuoteDraft, loadQuoteDraft, saveQuoteDraft } from "./draft";

const WHATSAPP_PHONE = "5511943814636";

type Service = "tint" | "audio" | "wrap" | "chrome" | "lighting" | "wheels";

export default function QuoteWizard() {
  const router = useRouter();
  const { tokens } = useTheme();
  const { t } = useT();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState(0);
  const [service, setService] = useState<Service | null>(null);
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);

  const steps = useMemo(
    () => [
      { title: t("quote.step1Title"), icon: "grid-outline" as const },
      { title: t("quote.step2Title"), icon: "car-outline" as const },
      { title: t("quote.step3Title"), icon: "camera-outline" as const },
      { title: t("quote.step4Title"), icon: "chatbubbles-outline" as const },
    ],
    [t]
  );

  const serviceOptions: { id: Service; label: string; desc: string }[] = useMemo(
    () => [
      { id: "tint", label: t("quote.serviceTint"), desc: t("quote.serviceTintDesc") },
      { id: "audio", label: t("quote.serviceAudio"), desc: t("quote.serviceAudioDesc") },
      { id: "wrap", label: t("quote.serviceWrap"), desc: t("quote.serviceWrapDesc") },
      { id: "chrome", label: t("quote.serviceChrome"), desc: t("quote.serviceChromeDesc") },
      { id: "lighting", label: t("quote.serviceLighting"), desc: t("quote.serviceLightingDesc") },
      { id: "wheels", label: t("quote.serviceWheels"), desc: t("quote.serviceWheelsDesc") },
    ],
    [t]
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      const d = await loadQuoteDraft();
      if (!alive || !d) return;

      if (typeof d.step === "number") setStep(Math.max(0, Math.min(3, d.step)));
      if (typeof d.service === "string") setService(d.service as Service);
      if (typeof d.carModel === "string") setCarModel(d.carModel);
      if (typeof d.carYear === "string") setCarYear(d.carYear);
      if (typeof d.name === "string") setName(d.name);
      if (typeof d.phone === "string") setPhone(d.phone);
      if (Array.isArray(d.photos)) setPhotos(d.photos.filter(Boolean));
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      saveQuoteDraft({
        step,
        service,
        carModel,
        carYear,
        name,
        phone,
        photos,
      });
    }, 250);
    return () => clearTimeout(id);
  }, [step, service, carModel, carYear, name, phone, photos]);

  function canContinue() {
    if (step === 0) return !!service;
    if (step === 1) return carModel.trim().length >= 2 && carYear.trim().length >= 2;
    if (step === 2) return true; // photos optional
    if (step === 3) return name.trim().length >= 2 && phone.trim().length >= 5;
    return false;
  }

  function next() {
    if (!canContinue()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep((s) => Math.min(s + 1, 3));
  }

  function back() {
    Haptics.selectionAsync();
    if (step === 0) router.back();
    else setStep((s) => Math.max(s - 1, 0));
  }

  async function pickPhotos() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(t("quotePhotos.permissionTitle"), t("quotePhotos.permissionMedia"));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"] as ImagePicker.MediaType[],
      quality: 0.85,
      allowsMultipleSelection: true,
      selectionLimit: 8,
    });

    if (result.canceled) return;

    const uris = result.assets.map((a) => a.uri).filter(Boolean);
    setPhotos((prev) => Array.from(new Set([...prev, ...uris])).slice(0, 12));
  }

  function removePhoto(uri: string) {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  }

  async function submitToWhatsApp() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const serviceLabel = serviceOptions.find((s) => s.id === service)?.label ?? "-";
    const msg =
      `Olá! Quero um orçamento.\n` +
      `Serviço: ${serviceLabel}\n` +
      `Carro: ${carModel} (${carYear})\n` +
      `Nome: ${name}\n` +
      `Contato: ${phone}\n` +
      (photos.length ? `Fotos: tenho ${photos.length} fotos prontas para enviar.\n` : "") +
      `\nPosso enviar fotos agora?`;

    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(msg)}`;

    await clearQuoteDraft();
    Linking.openURL(url).catch(() => {});
  }

  return (
    <Screen>
      <View
        style={{
          paddingHorizontal: tokens.space.xl,
          paddingTop: Math.max(insets.top, tokens.space.md) + tokens.space.sm,
          paddingBottom: tokens.space.md,
          borderBottomWidth: 1,
          borderBottomColor: tokens.color.hairline,
          backgroundColor: tokens.color.surface,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={back}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Ionicons name="chevron-back" size={22} color={tokens.color.ink} />
        </Pressable>

        <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, letterSpacing: -0.15 }}>
          {t("quote.title")}
        </Text>

        <Pressable
          onPress={async () => {
            await saveQuoteDraft({ step, service, carModel, carYear, name, phone, photos });
            router.back();
          }}
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <Ionicons name="close" size={20} color={tokens.color.muted} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: tokens.space.xl }}>
        <Container style={{ paddingTop: tokens.space.lg }}>
          <SoftCard style={{ padding: tokens.space.lg }}>
            <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 18, letterSpacing: -0.15 }}>
              {t("quote.hero")}
            </Text>
            <Text style={{ color: tokens.color.muted, marginTop: 8, fontSize: 12, lineHeight: 16 }}>
              {t("quote.heroSub")}
            </Text>

            <View style={{ flexDirection: "row", marginTop: tokens.space.md }}>
              {steps.map((s, i) => {
                const active = i === step;
                const done = i < step;
                return (
                  <View key={i} style={{ flex: 1, alignItems: "center" }}>
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 14,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1,
                        borderColor: active || done ? "rgba(255,0,0,0.55)" : tokens.color.hairline,
                        backgroundColor: done ? tokens.color.accentSoft : tokens.color.surface,
                      }}
                    >
                      <Ionicons name={done ? "checkmark" : s.icon} size={18} color={active || done ? tokens.color.accent : tokens.color.muted} />
                    </View>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: active ? tokens.color.ink : tokens.color.muted,
                        marginTop: 8,
                        fontSize: 10,
                        fontWeight: "900",
                        maxWidth: 70,
                      }}
                    >
                      {s.title}
                    </Text>
                  </View>
                );
              })}
            </View>
          </SoftCard>

          <View style={{ marginTop: tokens.space.lg }}>
            <Divider />
          </View>

          {step === 0 ? (
            <View style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, letterSpacing: -0.15 }}>
                {t("quote.pickService")}
              </Text>

              <View style={{ marginTop: 12 }}>
                {serviceOptions.map((opt) => (
                  <View key={opt.id} style={{ marginBottom: 10 }}>
                    <SelectCard title={opt.label} sub={opt.desc} selected={service === opt.id} onPress={() => setService(opt.id)} />
                  </View>
                ))}
              </View>
            </View>
          ) : null}

          {step === 1 ? (
            <View style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, letterSpacing: -0.15 }}>
                {t("quote.vehicleInfo")}
              </Text>

              <View style={{ marginTop: 12 }}>
                <Input label={t("quote.model")} value={carModel} onChangeText={setCarModel} placeholder={t("quote.modelPh")} />
                <View style={{ height: 10 }} />
                <Input label={t("quote.year")} value={carYear} onChangeText={setCarYear} placeholder={t("quote.yearPh")} keyboardType="number-pad" />
              </View>
            </View>
          ) : null}

          {step === 2 ? (
            <View style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, letterSpacing: -0.15 }}>
                {t("quote.photos")}
              </Text>

              <Card style={{ marginTop: 12 }}>
                <Text style={{ color: tokens.color.muted, fontSize: 12, lineHeight: 16 }}>
                  {t("quotePhotos.photosTip")}
                </Text>

                <View style={{ marginTop: 12 }}>
                  <PrimaryButton label={t("quotePhotos.addPhotos")} onPress={pickPhotos} />
                </View>

                {photos.length ? (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 }}>
                    {photos.map((uri) => (
                      <View key={uri} style={{ width: 92, height: 92, borderRadius: 16, overflow: "hidden", position: "relative" }}>
                        <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
                        <Pressable
                          onPress={() => removePhoto(uri)}
                          style={({ pressed }) => ({
                            opacity: pressed ? 0.85 : 1,
                            position: "absolute",
                            top: 6,
                            right: 6,
                            width: 26,
                            height: 26,
                            borderRadius: 13,
                            backgroundColor: "rgba(0,0,0,0.55)",
                            alignItems: "center",
                            justifyContent: "center",
                          })}
                        >
                          <Ionicons name="close" size={16} color="white" />
                        </Pressable>
                      </View>
                    ))}
                  </View>
                ) : null}
              </Card>
            </View>
          ) : null}

          {step === 3 ? (
            <View style={{ marginTop: tokens.space.lg }}>
              <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 16, letterSpacing: -0.15 }}>
                {t("quote.contact")}
              </Text>

              <View style={{ marginTop: 12 }}>
                <Input label={t("quote.name")} value={name} onChangeText={setName} placeholder={t("quote.namePh")} />
                <View style={{ height: 10 }} />
                <Input label={t("quote.phone")} value={phone} onChangeText={setPhone} placeholder={t("quote.phonePh")} keyboardType="phone-pad" />
              </View>

              <View style={{ marginTop: tokens.space.lg }}>
                <PrimaryButton label={t("quote.sendWhatsApp")} onPress={submitToWhatsApp} disabled={!canContinue()} />
              </View>

              {photos.length ? (
                <Text style={{ color: tokens.color.muted, marginTop: 10, fontSize: 12 }}>
                  {t("quotePhotos.whatsAppPhotosNote")}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={{ marginTop: tokens.space.xl }}>
            {step < 3 ? (
              <PrimaryButton label={t("common.continue")} onPress={next} disabled={!canContinue()} />
            ) : (
              <GhostButton label={t("common.done")} onPress={() => router.back()} />
            )}
          </View>
        </Container>
      </ScrollView>
    </Screen>
  );
}

function SelectCard({ title, sub, selected, onPress }: { title: string; sub: string; selected: boolean; onPress: () => void }) {
  const { tokens } = useTheme();
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {({ pressed }) => (
        <Card
          style={{
            borderWidth: 1,
            borderColor: selected ? "rgba(255,0,0,0.6)" : tokens.color.hairline,
            backgroundColor: selected ? tokens.color.accentSoft : tokens.color.surface,
            transform: [{ translateY: pressed ? 1 : 0 }],
          }}
        >
          <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 14, letterSpacing: -0.1 }}>{title}</Text>
          <Text style={{ color: tokens.color.muted, marginTop: 6, fontSize: 12, lineHeight: 16 }}>{sub}</Text>
        </Card>
      )}
    </Pressable>
  );
}

type InputProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

function Input({ label, value, onChangeText, placeholder, keyboardType, autoCapitalize }: InputProps) {
  const { tokens } = useTheme();
  return (
    <View>
      <Text style={{ color: tokens.color.ink, fontWeight: "900", fontSize: 12, letterSpacing: -0.1 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={tokens.color.muted}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={{
          marginTop: 8,
          borderWidth: 1,
          borderColor: tokens.color.hairline,
          backgroundColor: tokens.color.surface,
          borderRadius: 16,
          paddingHorizontal: 14,
          paddingVertical: 12,
          color: tokens.color.ink,
          fontWeight: "700",
        }}
      />
    </View>
  );
}
