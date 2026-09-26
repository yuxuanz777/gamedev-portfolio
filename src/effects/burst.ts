/**
 * A short burst of gold and jade sparks from an element — used to confirm an action
 * (copying the email, sending a message). Skipped when reduced motion is preferred.
 */
export function burstFrom(el: Element, count = 22) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = el.getBoundingClientRect()
  const cx = rect.left + rect.width / 2
  const cy = rect.top + rect.height / 2
  const layer = document.createElement('div')
  layer.setAttribute('aria-hidden', 'true')
  layer.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:120;overflow:hidden'
  document.body.appendChild(layer)
  for (let i = 0; i < count; i++) {
    const spark = document.createElement('span')
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4
    const dist = 50 + Math.random() * 90
    const size = 3 + Math.random() * 4
    const gold = Math.random() > 0.35
    spark.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:${size}px;height:${size}px;` +
      `background:${gold ? '#f4dca3' : '#9de6bd'};box-shadow:0 0 10px ${gold ? '#e2bd72' : '#9de6bd'};` +
      'transform:translate(-50%,-50%) rotate(45deg);'
    layer.appendChild(spark)
    spark.animate([
      { transform: 'translate(-50%,-50%) rotate(45deg) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist - 20}px)) rotate(225deg) scale(0.2)`, opacity: 0 }
    ], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'forwards' })
  }
  const ring = document.createElement('span')
  ring.style.cssText = `position:absolute;left:${cx}px;top:${cy}px;width:20px;height:20px;border:1px solid #e2bd72;border-radius:50%;transform:translate(-50%,-50%)`
  layer.appendChild(ring)
  ring.animate([
    { transform: 'translate(-50%,-50%) scale(1)', opacity: 0.9 },
    { transform: 'translate(-50%,-50%) scale(9)', opacity: 0 }
  ], { duration: 700, easing: 'ease-out', fill: 'forwards' })
  window.setTimeout(() => layer.remove(), 1300)
}
