import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

const fallbackBackgroundVideo = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&mute=1&controls=0&loop=1&playlist=ScMzIvxBSi4&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1";
const fallbackModalVideo = "https://www.youtube.com/embed/ScMzIvxBSi4?autoplay=1&rel=0";

// Extract YouTube video ID
const extractYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : '';
};

function processVideos(data) {
    let backgroundVideoUrl = fallbackBackgroundVideo;
    let modalVideoUrl = fallbackModalVideo;
    let isYouTubeBackground = true;
    let isYouTubeModal = true;

    if (data && data.length > 0) {
        // Find background video
        const bgVideo = data.find(v => v.is_background);
        if (bgVideo) {
            const isYT = bgVideo.video_url.includes('youtube');
            isYouTubeBackground = isYT;
            if (isYT) {
                const videoId = extractYouTubeId(bgVideo.video_url);
                backgroundVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&playsinline=1&rel=0&showinfo=0`;
            } else {
                backgroundVideoUrl = bgVideo.video_url;
            }
        }

        // Find modal video
        const mdlVideo = data.find(v => v.is_modal);
        if (mdlVideo) {
            const isYT = mdlVideo.video_url.includes('youtube');
            isYouTubeModal = isYT;
            if (isYT) {
                const videoId = extractYouTubeId(mdlVideo.video_url);
                modalVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            } else {
                modalVideoUrl = mdlVideo.video_url;
            }
        } else if (data.length > 0) {
            const firstVideo = data[0];
            const isYT = firstVideo.video_url.includes('youtube');
            isYouTubeModal = isYT;
            if (isYT) {
                const videoId = extractYouTubeId(firstVideo.video_url);
                modalVideoUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
            } else {
                modalVideoUrl = firstVideo.video_url;
            }
        }
    }

    return { backgroundVideoUrl, modalVideoUrl, isYouTubeBackground, isYouTubeModal };
}

export function useVideos() {
    const { data, isLoading } = useQuery({
        queryKey: ['ocakbasiVideos'],
        queryFn: async () => {
            if (!supabase) return null;

            const { data, error } = await supabase
                .from('ocakbasi_videos')
                .select('id, video_url, is_background, is_modal')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error || !data || data.length === 0) {
                return null;
            }

            return data;
        },
    });

    const result = processVideos(data);

    return {
        ...result,
        isLoading,
    };
}
