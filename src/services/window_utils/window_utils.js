
export const windowWidth = () =>
  window.innerWidth ||
  document.documentElement.clientWidth ||
  document.body.clientWidth

export const windowHeight = () =>
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight

export const getLayout = (w, h) => {
  if (w > 1200) {
    return '3column'
  } else if (w > 800) {
    return '2column'
  } else {
    return '1column'
  }
}
