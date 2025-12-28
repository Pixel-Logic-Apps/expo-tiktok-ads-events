import TiktokAdsEvents, {TikTokLaunchApp, TikTokStandardEvents} from "expo-tiktok-ads-events";
import {requestTrackingPermissionsAsync} from "expo-tracking-transparency";
import {useEffect, useMemo, useState} from "react";
import {Alert, Pressable, StyleSheet, ScrollView, Text, View} from "react-native";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

export default function App() {
    const eventEntries = useMemo(
        () => Object.entries(TikTokStandardEvents) as [keyof typeof TikTokStandardEvents, string][],
        [],
    );
    const [selectedEventKey, setSelectedEventKey] = useState<keyof typeof TikTokStandardEvents>(
        eventEntries[0]?.[0] ?? "launch_app",
    );
    const selectedEventValue = TikTokStandardEvents[selectedEventKey];
    const [anonymousID, setAnonymousID] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");
    const [testEventCode, setTestEventCode] = useState<string>("");

    useEffect(() => {
        (async () => {
            const {status} = await requestTrackingPermissionsAsync();

            TiktokAdsEvents.initializeSdk("<APP_SECRET>", "<APP_ID>", "<APP_TIKTOK_ID>", false)//isDebugModeEnabled
            .then(async (result) => {
                alert("result: " + result);
                TiktokAdsEvents.identify("USER_ID00001");
                TikTokLaunchApp();

                // Buscar identificadores após inicialização
                const anonymousID = await TiktokAdsEvents.getAnonymousID();
                const accessToken = await TiktokAdsEvents.getAccessToken();
                const testEventCode = await TiktokAdsEvents.getTestEventCode();
                setAnonymousID(anonymousID);
                setAccessToken(accessToken);
                setTestEventCode(testEventCode);
            })
            .catch((error) => {
                alert("error: " + error);
            });
        })();
    }, []);

    const handleTrackEvent = async () => {
        try {
            console.log("Tracking TT Event", selectedEventValue);
            const result = await TiktokAdsEvents.trackTTEvent(selectedEventValue, [{key: "test", value: "test"}]);
            console.log("Result:", result);
            Alert.alert(
                "Track TT Event",
                JSON.stringify({eventKey: selectedEventKey, eventName: selectedEventValue, result}, null, 2),
            );
        } catch (error) {
            console.error("Error tracking event", error);
            Alert.alert(
                "Erro ao rastrear",
                JSON.stringify({eventKey: selectedEventKey, message: String(error)}, null, 2),
            );
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
                <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
                    <Group name="Identificadores">
                        <Text style={styles.infoText}>
                            AnonymousID: {"\n"}
                            {anonymousID || "-"}
                        </Text>
                        <Text style={styles.infoText}>
                            Access token: {"\n"}
                            {accessToken || "-"}
                        </Text>
                        <Text style={styles.infoText}>
                            Test event code: {"\n"}
                            {testEventCode || "-"}
                        </Text>
                    </Group>
                    <Group name="TiktokAdsEvents">
                        <Text style={styles.infoText}>Evento selecionado: {selectedEventValue}</Text>

                        {eventEntries.map(([key, value]) => {
                            const isSelected = key === selectedEventKey;
                            return (
                                <Pressable
                                    key={key}
                                    onPress={() => setSelectedEventKey(key)}
                                    style={[styles.eventOption, isSelected ? styles.eventOptionSelected : null]}>
                                    <Text style={styles.eventOptionText}>{key}</Text>
                                    <Text style={styles.eventOptionValue}>{value}</Text>
                                </Pressable>
                            );
                        })}
                    </Group>
                </ScrollView>
                <View style={styles.footer}>
                    <Pressable
                        style={[styles.trackButton, {backgroundColor: anonymousID ? "#000" : "#ccc"}]}
                        disabled={!anonymousID}
                        onPress={handleTrackEvent}>
                        <Text style={styles.trackButtonText}>Track TT Event</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

function Group(props: {name: string; children: React.ReactNode}) {
    return (
        <View style={styles.group}>
            <Text style={styles.groupHeader}>{props.name}</Text>
            {props.children}
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        fontSize: 30,
        margin: 20,
    },
    groupHeader: {
        fontSize: 20,
        marginBottom: 20,
    },
    footer: {
        borderRadius: 10,
        paddingHorizontal: 20,
    },
    group: {
        margin: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
    },
    container: {
        flex: 1,
        backgroundColor: "#eee",
    },
    view: {
        flex: 1,
        height: 200,
    },
    infoText: {
        fontSize: 14,
        marginBottom: 10,
    },
    scrollContainer: {
        marginVertical: 10,
    },
    scrollContent: {
        paddingBottom: 10,
    },
    eventOption: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#f9f9f9",
        marginBottom: 10,
    },
    eventOptionSelected: {
        borderColor: "#000",
        backgroundColor: "#e0f2ff",
    },
    eventOptionText: {
        fontWeight: "600",
        marginBottom: 4,
    },
    eventOptionValue: {
        color: "#555",
    },
    trackButton: {
        backgroundColor: "#000",
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: "center",
    },
    trackButtonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
