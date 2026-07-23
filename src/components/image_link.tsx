import DefaultLink from "../assets/img/link.png";
import Facebook from "../assets/img/fb.png";
import FacebookColored from "../assets/img/fb_color.png";
import YouTube from "../assets/img/yt.png";
import YouTubeColored from "../assets/img/yt_color.png";
import BiliBili from "../assets/img/bilibili.png";

function getLevelImage(player: string): string {
    return new URL(`../assets/img/icons/${player}.png`, import.meta.url).href;
}

export function VideoLink({url}: {url: string}) {
    let vidSourceImg= DefaultLink;
    if (url.includes("facebook.com"))
        vidSourceImg = Facebook;
    else if (url.includes("youtube.com"))
        vidSourceImg = YouTube;
    else if (url.includes("bilibili.com"))
        vidSourceImg = BiliBili;

    return <a href={url}><img alt="link" src={vidSourceImg} width="25px" /></a>;
}

export function ContactLink({url}: {url: string}) {
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
        vidSourceImg = getLevelImage(player);
        type = "gd";
    }

    return <a href={url}><img alt={`contact_${type}`} src={vidSourceImg} width="50px" /></a>;
}