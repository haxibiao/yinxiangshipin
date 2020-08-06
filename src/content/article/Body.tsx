import React from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default function Body(props: any) {
    const [webHeight, setwebHeight] = React.useState(0);
    const { body } = props;

    return (
        <WebView
            style={{ flex: 1, height: webHeight }}
            // textZoom={100}
            source={{
                html: `<html>
                            <head>
                                <meta name="viewport" content="width=device-width, initial-scale=1.0,maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
                                <style type="text/css">
                                html,
                                body {
                                    font-size: large;
                                    margin: 0;
                                    padding: 0;
                                }

                                img {
                                    border-radius: 6px;
                                    max-width: 100%;
                                }

                                video {
                                    width: 100%;
                                }

                                a {
                                    pointer-events: none;
                                }

                                </style>
                            </head>
                            <body>
                                ${body || ''}
                            </body>
                        </html>
                    `,
            }}
            overScrollMode={'never'}
            scrollEnabled={false}
            directionalLockEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            originWhitelist={['*']}
            injectedJavaScript={'window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)'}
            onMessage={(event: any) => {
                const h = Number(event.nativeEvent.data);
                setwebHeight(h);
                // console.log('文章内容高度', h);
            }}
        />
    );
}
