
// 下载图片
export function downloadPic(url, name) {
    let image = new Image();
    image.setAttribute("crossOrigin", "anonymous");
    image.src = process.env.VUE_APP_API_BASE_URL + '/' + url;
    image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, image.width, image.height);
        canvas.toBlob((blob) => {
            let href = URL.createObjectURL(blob);
            let Link = document.createElement("a");
            Link.download = name;
            Link.href = href;
            Link.click();
            Link.remove();
            // 用完释放URL对象
            URL.revokeObjectURL(url);
        });
    };
}