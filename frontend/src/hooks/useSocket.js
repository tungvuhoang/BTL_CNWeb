import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { sockJsUrl } from '../config/backend';

export const useSocket = (roomId, onMessageReceived) => {
    const stompClient = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const savedCallback = useRef(onMessageReceived);

    // Remember the latest callback if it changes.
    useEffect(() => {
        savedCallback.current = onMessageReceived;
    }, [onMessageReceived]);

    useEffect(() => {
        if (!roomId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(sockJsUrl),
            reconnectDelay: 5000,
            onConnect: () => {
                setIsConnected(true);
                console.log('Connected to WS server');

                const topics = [
                    `/topic/rooms/${roomId}`,
                    `/topic/rooms/${roomId}/players`,
                    `/topic/rooms/${roomId}/question`,
                    `/topic/rooms/${roomId}/leaderboard`
                ];

                topics.forEach(topic => {
                    client.subscribe(topic, (message) => {
                        if (message.body) {
                            try {
                                const parsed = JSON.parse(message.body);
                                if (savedCallback.current) {
                                    savedCallback.current(topic, parsed);
                                }
                            } catch (error) {
                                console.error('Failed to parse message payload:', error);
                            }
                        }
                    });
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
            onDisconnect: () => {
                setIsConnected(false);
                console.log('Disconnected from WS server');
            }
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (client.active) {
                client.deactivate();
            }
        };
    }, [roomId]);

    const sendMessage = useCallback((destination, body) => {
        if (stompClient.current && stompClient.current.active) {
            stompClient.current.publish({ destination, body: JSON.stringify(body) });
        } else {
            console.warn('Cannot send message, stomp client is not active');
        }
    }, []);

    return { isConnected, sendMessage };
};
