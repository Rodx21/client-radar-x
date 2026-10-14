import { useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, Linking, Image, ImageBackground, TextInput } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigation } from "expo-router";
import { CLIENT } from "@/config/client";
import { useT } from "@/app/i18n";
import { Screen } from "@/app/theme/ui";
import { AMS, BRAND_FONT } from "@/app/theme/brand";
import { formatBRPhone } from "@/app/lib/phone";

const MAX = 1440;

// Simulation-only stock photos (Unsplash) standing in for real shop/customer-car
// photos, purely so the layout can be previewed with imagery instead of gray
// boxes. Swap every one of these for the client's real photos before shipping.
const STOCK = {
  hero: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=1600&q=70&auto=format&fit=crop", // BMW M4, dusk
  pelicula: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=70&auto=format&fit=crop", // interior POV, city lights through glass
  tint: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=700&q=70&auto=format&fit=crop", // Mustang, dramatic front
  audio: "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?w=700&q=70&auto=format&fit=crop", // BMW 7-series, front
  wrap: "https://images.unsplash.com/photo-1519245659620-e859806a8d3b?w=700&q=70&auto=format&fit=crop", // matte Lamborghini Huracán
  galleryBig: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1100&q=70&auto=format&fit=crop", // Ferrari LaFerrari, showroom
  gallerySmall1: "https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=700&q=70&auto=format&fit=crop", // Huracán Spyder, red wheels
  gallerySmall2: "https://images.unsplash.com/photo-1542362567-b07e54358753?w=700&q=70&auto=format&fit=crop", // McLaren, stripe wrap
};

// Prices/names match the real `services` catalog (business.services table) —
// keep these in sync with what's actually configured in the admin panel, not
// the design handoff's example numbers.
const BIG_SERVICES = [
  { id: "tint", title: "Película Premium", desc: "Duas camadas, bloqueio de calor e proteção UV — aplicação em 2 a 4h.", price: "A partir de R$ 399", photo: STOCK.tint },
  { id: "audio", title: "Som e Multimídia", desc: "Instalação profissional de som e central multimídia.", price: "A partir de R$ 450", photo: STOCK.audio },
  { id: "wrap", title: "Envelopamento", desc: "Proteção e personalização com vinil de acabamento premium.", price: "A partir de R$ 1.200", photo: STOCK.wrap },
];

const COMPACT_SERVICES = [
  { title: "Chrome Delete", price: "R$ 350" },
  { title: "Iluminação LED", price: "R$ 280" },
  { title: "Rodas e Pneus", price: "R$ 300" },
];

const TESTIMONIALS = [
  { quote: "Levei achando que ia ficar o dia todo. Em três horas o carro tava pronto e a película ficou impecável.", name: "Rafael M.", car: "Jeep Compass" },
  { quote: "Coloquei o multimídia e voltei duas semanas depois pro envelopamento. Trabalho limpo, sem stress.", name: "Camila S.", car: "Honda Civic" },
  { quote: "Já indiquei pra três amigos. Preço fechado antes de começar, sem surpresa na hora de pagar.", name: "Diego F.", car: "VW Polo" },
];

const SPEC_LINES = [
  { label: "Bloqueio de calor", value: "até 70%" },
  { label: "Proteção UV", value: "99%" },
  { label: "Dentro da lei (CONTRAN)", value: "sim, com laudo" },
];

const SERVICE_CHIPS = ["Película", "Som", "Envelopamento", "Acessórios"];

// Full desktop "site público" — Auto Music Sound design handoff v2 (2026-08-20).
// Public surfaces are permanently dark; red is used only for action/alert.
// Section order and copy follow the handoff spec; photos are gray placeholders
// pending real assets from the client.
export function DesktopSite() {
  const router = useRouter();
  const navigation = useNavigation();
  const { t } = useT();
  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Record<string, number>>({});
  const [chip, setChip] = useState(SERVICE_CHIPS[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [modelo, setModelo] = useState("");

  const wa = (msg: string) => Linking.openURL(`https://wa.me/${CLIENT.whatsappPhone}?text=${encodeURIComponent(msg)}`).catch(() => {});
  const quickWa = () => wa("Olá! Vi o site e quero um orçamento.");

  function scrollToSection(key: string) {
    const y = sectionY.current[key];
    if (y != null) scrollRef.current?.scrollTo({ y: Math.max(0, y - 70), animated: true });
  }
  // Records a section's vertical offset for scrollToSection — only ever read
  // from the onLayout event handler itself, never during render.
  function onSectionLayout(key: string, e: { nativeEvent: { layout: { y: number } } }) {
    sectionY.current[key] = e.nativeEvent.layout.y;
  }

  function submitForm() {
    const msg = `Olá! Quero um orçamento.\nServiço: ${chip}\nModelo: ${modelo || "—"}\nNome: ${name || "—"}\nContato: ${phone || "—"}`;
    wa(msg);
  }

  return (
    <Screen>
      <ScrollView ref={scrollRef} contentContainerStyle={{ paddingBottom: 0 }}>

        {/* Urgency bar */}
        <View style={{ backgroundColor: AMS.red }}>
          <Row style={{ justifyContent: "space-between", paddingVertical: 11 }}>
            <Eyebrow color="#FFFFFF">Aplicação no mesmo dia · Rua Serra de Botucatu, 2100</Eyebrow>
            <Eyebrow color="#FFFFFF">Orçamento no WhatsApp {formatBRPhone(CLIENT.whatsappPhone)}</Eyebrow>
          </Row>
        </View>

        {/* Header */}
        <View style={{ backgroundColor: AMS.black, borderBottomWidth: 1, borderBottomColor: AMS.hairlineOnDark }}>
          <Row style={{ paddingVertical: 18, justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
              <Pressable
                onPress={() => navigation.dispatch({ type: "OPEN_DRAWER" })}
                accessibilityRole="button"
                accessibilityLabel="Abrir menu"
                style={{ width: 40, height: 40, borderRadius: 14, borderWidth: 1, borderColor: AMS.hairlineOnDark, alignItems: "center", justifyContent: "center" }}
              >
                <Ionicons name="menu-outline" size={20} color="#FFFFFF" />
              </Pressable>
              <Image source={CLIENT.logo} style={{ width: 130, height: 46, resizeMode: "contain" }} />
            </View>

            <View style={{ flexDirection: "row", gap: 30 }}>
              <NavLink label={t("nav.home")} onPress={() => router.push("/(drawer)/(tabs)/inicio")} strong />
              <NavLink label={t("nav.services")} onPress={() => router.push("/(drawer)/(tabs)/services")} />
              <NavLink label={t("nav.gallery")} onPress={() => router.push("/(drawer)/(tabs)/gallery")} />
              <NavLink label={t("nav.agenda")} onPress={() => router.push("/(drawer)/(tabs)/agenda")} />
              <NavLink label="Portal do cliente" onPress={() => router.push("/login")} />
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
              <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.semibold, fontSize: 13 }}>{formatBRPhone(CLIENT.landlinePhone)}</Text>
              <RedButton label="Orçamento por whats" onPress={quickWa} />
            </View>
          </Row>
        </View>

        {/* Hero — full-bleed photo with a diagonal scrim so the headline stays readable */}
        <ImageBackground source={{ uri: STOCK.hero }} style={{ height: 660, justifyContent: "center" }}>
          <LinearGradient
            colors={["rgba(10,10,10,0.92)", "rgba(10,10,10,0.55)", "rgba(10,10,10,0.25)"]}
            locations={[0, 0.46, 1]}
            start={{ x: 0, y: 0.15 }}
            end={{ x: 1, y: 0.85 }}
            style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
          />
          <View style={{ maxWidth: MAX, width: "100%", marginHorizontal: "auto", paddingHorizontal: 44 }}>
            <View style={{ maxWidth: 760 }}>
              <View style={{ width: 30, height: 3, backgroundColor: AMS.red, marginBottom: 18 }} />
              <Eyebrow color={AMS.chrome}>A melhor película premium de SP</Eyebrow>
              <Text style={{ marginTop: 14, color: "#FFFFFF", fontFamily: BRAND_FONT.black, fontSize: 92, lineHeight: 83, letterSpacing: -0.9 }}>
                ESCURO POR FORA,{"\n"}<Text style={{ color: AMS.red }}>CLARO POR DENTRO</Text>
              </Text>
              <Text style={{ marginTop: 22, color: AMS.onDarkBody, fontFamily: BRAND_FONT.regular, fontSize: 17, lineHeight: 27, maxWidth: 520 }}>
                Película premium, som e envelopamento no mesmo endereço. Aplicação no mesmo dia, garantia de verdade e orçamento fechado antes de começar.
              </Text>
              <View style={{ flexDirection: "row", gap: 16, marginTop: 32 }}>
                <RedButton label="Pedir orçamento" big onPress={() => router.push("/quote")} />
                <OutlineButton label="Ver trabalhos" big onPress={() => scrollToSection("galeria")} />
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* KPI band */}
        <View style={{ backgroundColor: AMS.black2 }}>
          <Row style={{ paddingVertical: 28 }}>
            <Kpi value="+18 anos" label="Na Serra de Botucatu" />
            <Kpi value="2 a 4 h" label="Película pronta no dia" />
            <Kpi value="5 anos" label="Garantia na aplicação" />
            <Kpi value="4,9 / 5" label="Avaliações no Google" valueColor={AMS.red} last />
          </Row>
        </View>

        {/* Película explanation */}
        <View onLayout={(e) => onSectionLayout("pelicula", e)} style={{ backgroundColor: AMS.black }}>
          <View style={{ maxWidth: MAX, width: "100%", marginHorizontal: "auto", flexDirection: "row", gap: 56, paddingHorizontal: 44, paddingVertical: 76 }}>
            <Image source={{ uri: STOCK.pelicula }} style={{ flex: 1, height: 440, borderRadius: 4, backgroundColor: AMS.black2 }} resizeMode="cover" />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Eyebrow color={AMS.red}>Película premium</Eyebrow>
              <Text style={{ marginTop: 10, color: "#FFFFFF", fontFamily: BRAND_FONT.black, fontSize: 52, letterSpacing: -0.5 }}>DUAS CAMADAS, DOIS EFEITOS</Text>
              <Text style={{ marginTop: 16, color: AMS.onDarkBody, fontSize: 15, lineHeight: 25 }}>
                A camada externa corta o calor antes que ele entre; a interna protege o painel e o couro contra o UV. O resultado: cabine mais fresca sem perder visibilidade à noite.
              </Text>
              <View style={{ marginTop: 24 }}>
                {SPEC_LINES.map((s, i) => (
                  <View key={s.label} style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 12, borderTopWidth: i === 0 ? 1 : 0, borderBottomWidth: 1, borderColor: AMS.hairlineOnDark }}>
                    <Text style={{ color: AMS.onDarkSecondary, fontSize: 13 }}>{s.label}</Text>
                    <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.bold, fontSize: 13 }}>{s.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Services */}
        <View onLayout={(e) => onSectionLayout("servicos", e)} style={{ backgroundColor: AMS.black }}>
          <View style={{ maxWidth: MAX, width: "100%", marginHorizontal: "auto", paddingHorizontal: 44, paddingVertical: 76 }}>
            <Row style={{ justifyContent: "space-between", marginBottom: 32 }}>
              <View>
                <Eyebrow color={AMS.chrome}>Serviços</Eyebrow>
                <Text style={{ marginTop: 8, color: "#FFFFFF", fontFamily: BRAND_FONT.black, fontSize: 48 }}>TUDO NO MESMO BOX</Text>
              </View>
              <Pressable onPress={quickWa}><Text style={{ color: AMS.red, fontFamily: BRAND_FONT.bold, fontSize: 13 }}>Ver preços →</Text></Pressable>
            </Row>

            <View style={{ flexDirection: "row", gap: 22 }}>
              {BIG_SERVICES.map((s) => (
                <Pressable key={s.id} onPress={quickWa} style={{ flex: 1 }}>
                  <Image source={{ uri: s.photo }} style={{ height: 230, borderRadius: 4, backgroundColor: AMS.black2, marginBottom: 14 }} resizeMode="cover" />
                  <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.extrabold, fontSize: 19 }}>{s.title}</Text>
                  <Text style={{ color: AMS.onDarkSecondary, fontSize: 13, marginTop: 6, lineHeight: 19 }}>{s.desc}</Text>
                  <Text style={{ color: AMS.red, fontFamily: BRAND_FONT.bold, fontSize: 14, marginTop: 10 }}>{s.price}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", marginTop: 32, borderWidth: 1, borderColor: AMS.hairlineOnDark, borderRadius: 4 }}>
              {COMPACT_SERVICES.map((s, i) => (
                <Pressable key={s.title} onPress={quickWa} style={{ flex: 1, paddingVertical: 18, paddingHorizontal: 20, borderRightWidth: i < COMPACT_SERVICES.length - 1 ? 1 : 0, borderColor: AMS.hairlineOnDark }}>
                  <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.semibold, fontSize: 13.5 }}>{s.title}</Text>
                  <Text style={{ color: AMS.red, fontFamily: BRAND_FONT.bold, fontSize: 12, marginTop: 6 }}>{s.price}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {/* Gallery */}
        <View onLayout={(e) => onSectionLayout("galeria", e)} style={{ backgroundColor: AMS.black }}>
          <View style={{ maxWidth: MAX, width: "100%", marginHorizontal: "auto", flexDirection: "row", gap: 2, paddingHorizontal: 44, paddingBottom: 76 }}>
            <Image source={{ uri: STOCK.galleryBig }} style={{ flex: 2, height: 430, backgroundColor: AMS.black2 }} resizeMode="cover" />
            <View style={{ flex: 1, gap: 2 }}>
              <Image source={{ uri: STOCK.gallerySmall1 }} style={{ flex: 1, backgroundColor: AMS.black2 }} resizeMode="cover" />
              <Image source={{ uri: STOCK.gallerySmall2 }} style={{ flex: 1, backgroundColor: AMS.black2 }} resizeMode="cover" />
            </View>
          </View>
        </View>

        {/* Testimonials */}
        <View style={{ backgroundColor: AMS.black }}>
          <View style={{ maxWidth: MAX, width: "100%", marginHorizontal: "auto", flexDirection: "row", gap: 22, paddingHorizontal: 44, paddingBottom: 76 }}>
            {TESTIMONIALS.map((tm) => (
              <View key={tm.name} style={{ flex: 1, borderWidth: 1, borderColor: AMS.hairlineOnDark, borderRadius: 4, padding: 26 }}>
                <Row style={{ gap: 3, marginBottom: 14 }}>
                  {[0, 1, 2, 3, 4].map((i) => <Ionicons key={i} name="star" size={13} color={AMS.red} />)}
                </Row>
                <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.quoteItalic, fontSize: 21, lineHeight: 29 }}>&ldquo;{tm.quote}&rdquo;</Text>
                <Text style={{ marginTop: 18, color: AMS.chrome, fontFamily: BRAND_FONT.semibold, fontSize: 11, letterSpacing: 1.5 }}>{tm.name.toUpperCase()} · {tm.car.toUpperCase()}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact + form */}
        <View style={{ backgroundColor: AMS.black, borderTopWidth: 1, borderTopColor: AMS.hairlineOnDark }}>
          <View style={{ maxWidth: MAX, width: "100%", marginHorizontal: "auto", flexDirection: "row", alignItems: "flex-start", gap: 56, paddingHorizontal: 44, paddingVertical: 76 }}>
            <View style={{ flex: 1.1 }}>
              <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.black, fontSize: 44, lineHeight: 48 }}>TRAGA O CARRO OU MANDE AS FOTOS</Text>
              <Text style={{ marginTop: 16, color: AMS.onDarkBody, fontSize: 15, lineHeight: 24, maxWidth: 440 }}>
                Manda as fotos do carro pelo WhatsApp que a gente já adianta o orçamento — ou passa direto na loja, sem hora marcada.
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 32, borderTopWidth: 1, borderColor: AMS.hairlineOnDark }}>
                <InfoCell label="Onde estamos" value="R. Serra de Botucatu, 2100" />
                <InfoCell label="Atendimento" value="Seg-Sex 9h-17h, Sáb 8h-16h" />
                <InfoCell label="Telefone" value={formatBRPhone(CLIENT.landlinePhone)} />
                <InfoCell label="WhatsApp" value={formatBRPhone(CLIENT.whatsappPhone)} />
              </View>
            </View>

            <View style={{ flex: 1, maxWidth: 460, backgroundColor: AMS.black2, borderRadius: 4, padding: 28 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                <FormField label="Nome" value={name} onChangeText={setName} />
                <FormField label="WhatsApp" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
              </View>
              <FormField label="Modelo e ano" value={modelo} onChangeText={setModelo} style={{ marginTop: 12 }} />
              <Text style={{ marginTop: 16, marginBottom: 8, color: AMS.onDarkSecondary, fontSize: 11, fontFamily: BRAND_FONT.bold, letterSpacing: 1.5 }}>SERVIÇO DESEJADO</Text>
              <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
                {SERVICE_CHIPS.map((c) => (
                  <Pressable key={c} onPress={() => setChip(c)} style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 40, borderWidth: 1, borderColor: chip === c ? AMS.red : AMS.hairlineOnDark, backgroundColor: chip === c ? "rgba(217,18,31,0.16)" : "transparent" }}>
                    <Text style={{ color: chip === c ? "#FFFFFF" : AMS.onDarkSecondary, fontSize: 12.5, fontFamily: BRAND_FONT.semibold }}>{c}</Text>
                  </Pressable>
                ))}
              </View>
              <View style={{ marginTop: 20 }}>
                <RedButton label="Enviar no WhatsApp" onPress={submitForm} full />
              </View>
              <Text style={{ marginTop: 12, textAlign: "center", color: AMS.onDarkSecondary, fontSize: 11 }}>Respondemos em até 15 min no horário comercial.</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={{ backgroundColor: AMS.black, borderTopWidth: 1, borderTopColor: AMS.hairlineOnDark }}>
          <Row style={{ paddingVertical: 22, justifyContent: "space-between" }}>
            <Text style={{ color: AMS.onDarkSecondary, fontSize: 11, letterSpacing: 1.4, fontFamily: BRAND_FONT.semibold }}>{CLIENT.businessName.toUpperCase()} · R. SERRA DE BOTUCATU, 2100</Text>
            <Pressable onPress={() => Linking.openURL(CLIENT.instagramUrl).catch(() => {})}>
              <Text style={{ color: AMS.onDarkSecondary, fontSize: 11, letterSpacing: 1.4, fontFamily: BRAND_FONT.semibold }}>@{CLIENT.instagramHandle.toUpperCase()}</Text>
            </Pressable>
          </Row>
        </View>
      </ScrollView>
    </Screen>
  );
}

// ---- small local building blocks (kept private to this file — spec-specific, not reused elsewhere yet) ----

function Row({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[{ maxWidth: MAX, width: "100%", marginHorizontal: "auto", flexDirection: "row", alignItems: "center", paddingHorizontal: 44 }, style]}>{children}</View>;
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return <Text style={{ color, fontFamily: BRAND_FONT.bold, fontSize: 11, letterSpacing: 2.2, textTransform: "uppercase" }}>{children}</Text>;
}

function NavLink({ label, onPress, strong }: { label: string; onPress: () => void; strong?: boolean }) {
  return (
    <Pressable onPress={onPress}>
      <Text style={{ color: strong ? "#FFFFFF" : "rgba(255,255,255,0.7)", fontFamily: BRAND_FONT.bold, fontSize: 11, letterSpacing: 1.8, textTransform: "uppercase" }}>{label}</Text>
    </Pressable>
  );
}

function RedButton({ label, onPress, big, full }: { label: string; onPress: () => void; big?: boolean; full?: boolean }) {
  const [hover, setHover] = useState(false);
  return (
    <Pressable
      onPress={onPress}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        backgroundColor: hover ? AMS.redHover : AMS.red,
        paddingHorizontal: big ? 32 : 22,
        paddingVertical: big ? 18 : 14,
        borderRadius: 14,
        alignItems: "center",
        width: full ? "100%" : undefined,
      }}
    >
      <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.bold, fontSize: big ? 14 : 12.5 }}>{label}</Text>
    </Pressable>
  );
}

function OutlineButton({ label, onPress, big }: { label: string; onPress: () => void; big?: boolean }) {
  return (
    <Pressable onPress={onPress} style={{ borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", paddingHorizontal: big ? 32 : 22, paddingVertical: big ? 18 : 14, borderRadius: 14, alignItems: "center" }}>
      <Text style={{ color: "#FFFFFF", fontFamily: BRAND_FONT.bold, fontSize: big ? 14 : 12.5 }}>{label}</Text>
    </Pressable>
  );
}

function Kpi({ value, label, valueColor, last }: { value: string; label: string; valueColor?: string; last?: boolean }) {
  return (
    <View style={{ flex: 1, paddingHorizontal: 4, borderRightWidth: last ? 0 : 1, borderColor: AMS.hairlineOnDark }}>
      <Text style={{ color: valueColor ?? "#FFFFFF", fontFamily: BRAND_FONT.extrabold, fontSize: 28 }}>{value}</Text>
      <Text style={{ color: AMS.onDarkSecondary, fontSize: 12, marginTop: 4 }}>{label}</Text>
    </View>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{ width: "50%", paddingVertical: 16, borderBottomWidth: 1, borderColor: AMS.hairlineOnDark, paddingRight: 12 }}>
      <Text style={{ color: AMS.onDarkSecondary, fontSize: 10.5, letterSpacing: 1.4, fontFamily: BRAND_FONT.bold }}>{label.toUpperCase()}</Text>
      <Text style={{ color: "#FFFFFF", fontSize: 13.5, marginTop: 6, fontFamily: BRAND_FONT.medium }}>{value}</Text>
    </View>
  );
}

function FormField({ label, value, onChangeText, keyboardType, style }: { label: string; value: string; onChangeText: (v: string) => void; keyboardType?: "phone-pad"; style?: object }) {
  return (
    <View style={[{ flex: 1 }, style]}>
      <Text style={{ color: AMS.onDarkSecondary, fontSize: 10.5, letterSpacing: 1.2, fontFamily: BRAND_FONT.bold, marginBottom: 6 }}>{label.toUpperCase()}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholderTextColor="rgba(255,255,255,0.3)"
        style={{ borderWidth: 1, borderColor: AMS.hairlineOnDark, borderRadius: 4, paddingHorizontal: 12, paddingVertical: 11, color: "#FFFFFF", fontFamily: BRAND_FONT.regular, fontSize: 13.5 }}
      />
    </View>
  );
}
