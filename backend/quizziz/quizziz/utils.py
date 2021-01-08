import requests

VALID_IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
]


def valid_url_extension(url, extension_list=VALID_IMAGE_EXTENSIONS):
    try:
        image_request = requests.head(url)

        if image_request.status_code == requests.codes.ok:
            return any([url.endswith(e) for e in extension_list])
    except:
        return False
