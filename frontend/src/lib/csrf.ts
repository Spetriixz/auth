function getCookie(name: string) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie() {
  const newCookie = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  document.cookie = `csrf=${newCookie}; expires=${new Date(Date.now() + 300000).toUTCString()}; samesite=lax; path=/; secure` // Expires in 5 minutes
  return newCookie
}

function getCsrf() {
  const cookie = getCookie("csrf")
  if (cookie) {
    if (Date.now() > new Date(cookie).getTime() + 300000) {
      return setCookie()
    }
    return cookie
  } else {
    return setCookie()
  }
}

export { getCsrf }