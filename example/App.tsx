import {useEvent} from "expo";
import TiktokAdsEvents, { TikTokLaunchApp, TikTokStandardEvents } from "expo-tiktok-ads-events";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";
import {Button, Text, View} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {

    useEffect(() => {
        (async () => {
            const { status } = await requestTrackingPermissionsAsync();
            await TiktokAdsEvents.initializeSdk(
                "<APP_SECRET_KEY>",
                "<APP_ID>", 
                "<TIKTOK_APP_ID>");
            TiktokAdsEvents.identify("USER_ID00001");
            TikTokLaunchApp();
            const info = await TiktokAdsEvents.getAnonymousID();
            const accessToken = await TiktokAdsEvents.getAccessToken();
            const testEventCode = await TiktokAdsEvents.getTestEventCode();
            console.log("AnonymousID:", info);
            console.log("Access token:", accessToken);
            console.log("Test event code:", testEventCode);
        })();

    }, []);


    return (
        <SafeAreaProvider>
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <Group name="TiktokAdsEvents">
                <Button
                    title="Track TT Event"
                    onPress={async () => {
                        console.log("Tracking TT Event", TikTokStandardEvents.in_app_ad_impr);
                        const result = await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.in_app_ad_impr, [{key: "test", value: "test"}]);
                        console.log("Result:", result);
                    }}
                />
            </Group>
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

const styles = {
    header: {
        fontSize: 30,
        margin: 20,
    },
    groupHeader: {
        fontSize: 20,
        marginBottom: 20,
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
};
