import {useEvent} from "expo";
import TiktokAdsEvents, { TikTokLaunchApp, TikTokStandardEvents } from "expo-tiktok-ads-events";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";
import {Button, Text, View} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
    const onChangePayload = useEvent(TiktokAdsEvents, "onChange");

    useEffect(() => {
        (async () => {
            const { status } = await requestTrackingPermissionsAsync();
            const result = await TiktokAdsEvents.initializeSdk(
                "TTQxKwOmbqLWpjTsbJZhgcpsmwCXsFQx",
                "6752616459", 
                "7552104294998786049");
            console.log("Initialize SDK result:", result);
        })();

    }, []);


    return (
        <SafeAreaProvider>
        <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
            <Group name="TiktokAdsEvents">
                <Button
                    title="Track TT Event"
                    onPress={async () => {
                        await TiktokAdsEvents.trackTTEvent(TikTokStandardEvents.in_app_ad_impr);
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
