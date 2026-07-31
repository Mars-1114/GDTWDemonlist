import DefaultLink from "../assets/img/link.webp";
import Facebook from "../assets/img/fb.webp";
import FacebookColored from "../assets/img/fb_color.webp";
import YouTube from "../assets/img/yt.webp";
import YouTubeColored from "../assets/img/yt_color.webp";
import BiliBili from "../assets/img/bilibili.webp";

interface ImageLinkProps {
    url: string;
}

function getPlayerIcon(player: string): string {
    return new URL(`../assets/img/icons/${player}.webp`, import.meta.url).href;
}

export function VideoLink({url}: ImageLinkProps) {
    let vidSourceImg= DefaultLink;
    if (url.includes("facebook.com"))
        vidSourceImg = Facebook;
    else if (url.includes("youtube.com"))
        vidSourceImg = YouTube;
    else if (url.includes("bilibili.com"))
        vidSourceImg = BiliBili;

    return <a href={url}><img alt="link" src={vidSourceImg} width="25px" /></a>;
}

export function ContactLink({url}: ImageLinkProps) {
    let vidSourceImg= "";
    let type = "";
    if (url.includes("facebook.com")) {
        vidSourceImg = FacebookColored;
        type = "fb";
    }
    else if (url.includes("youtube.com")) {
        vidSourceImg = YouTubeColored;
        type = "yt";
    }
    else if (url.includes("gdbrowser.com")) {
        let [, player] = url.match(/u\/(.+)$/) || [];
        vidSourceImg = getPlayerIcon(player);
        type = "gd";
    }

    return <a href={url}><img alt={`contact_${type}`} src={vidSourceImg} width="50px" /></a>;
}