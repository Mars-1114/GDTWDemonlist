import DefaultLink from "../assets/img/link.png";
import Facebook from "../assets/img/fb.png";
import YouTube from "../assets/img/yt.png";
import BiliBili from "../assets/img/bilibili.png";

export function ImageLink({url}: {url: string}) {
    let vidSourceImg= DefaultLink;
    if (url.includes("facebook.com"))
        vidSourceImg = Facebook;
    else if (url.includes("youtube.com"))
        vidSourceImg = YouTube;
    else if (url.includes("bilibili.com"))
        vidSourceImg = BiliBili;

    return <a href={url}><img alt="link" src={vidSourceImg} width="25px" /></a>;
}