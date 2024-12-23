"use client";
import React, { useState } from 'react';

interface Message {
    type: "text" | "gif";
    content?: string;
    url?: string;
    time: number;
}

interface Gif {
    id: string;
    images: {
        fixed_height: {
            url: string;
        };
    };
}

const Home = () => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [giphyShow, setGiphyShow] = useState(false);

    const gifSearch = async (word: string) => {
        try {
            const response = await fetch(
                `https://api.giphy.com/v1/gifs/search?api_key=*****&q=${word}&limit=12`
            );
            const data = await response.json();
            return data.data;
        } catch (error) {
            console.error("ERROR", error);
        }
    };

    const sendGif = (gifUrl: string) => {
        const time = Date.now();
        setMessages(prev => [...prev, { type: "gif", url: gifUrl, time }]);
        setInput("");
        setGiphyShow(false);
    };

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInput(value);
    
        if (value.startsWith("/gif ")) {
            const word = value.slice(5).trim();
            setGiphyShow(!!word);
            if (word) {
                const gifs = await gifSearch(word);
                setGifs(gifs);
            }
        } else {
            setGiphyShow(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" && input.trim() && !giphyShow) {
            setMessages(prev => [...prev, { type: "text", content: input, time: Date.now() }]);
            setInput("");
        }
    };

    return (
        <div className="container">
            <div className="main-block">
                <div className="chat">
                    {messages.map((msg, index) => (
                        <div key={index} className="message-container">
                            {msg.type === "text" ? (
                                <div className="text-message">
                                    <p>{msg.content}</p>
                                </div>
                            ) : (
                                <div className="gif-message">
                                    <img src={msg.url} alt="gif" />
                                </div>
                            )}
                            <span className="message-time">
                                {new Date(msg.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    ))}
                </div>

                {giphyShow && (
                    <div className="gif-window">
                        <div className="scrolling">
                            <div className="gif-grid">
                                {gifs.map(gif => (
                                    <img
                                        key={gif.id}
                                        src={gif.images.fixed_height.url}
                                        className="gif-item"
                                        onClick={() => sendGif(gif.images.fixed_height.url)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                <div className="input-div">
                    <div className="input-preview">
                        {input.startsWith("/gif ") && (
                            <span className="highlight">/gif </span>
                        )}
                    </div>
                    <input
                        className="input-block roboto-regular"
                        placeholder="Type message or /gif..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        spellCheck={false}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
