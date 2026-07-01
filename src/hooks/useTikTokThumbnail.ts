import { useEffect, useState } from 'react';

// Lấy ảnh cover TikTok tự động qua link video — không cần tự upload ảnh.
// Nếu lỗi mạng thì tự động dùng lại ảnh cũ (fallback) trong data.json.
export function useTikTokThumbnail(tiktokUrl: string | undefined, fallback: string) {
    const [thumbnail, setThumbnail] = useState(fallback);

    useEffect(() => {
        if (!tiktokUrl) return;

        fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.thumbnail_url) setThumbnail(data.thumbnail_url);
            })
            .catch(() => {
                // TikTok chặn/lỗi mạng → cứ giữ ảnh cũ, không cần làm gì thêm.
            });
    }, [tiktokUrl]);

    return thumbnail;
}