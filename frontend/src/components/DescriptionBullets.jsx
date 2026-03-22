import { descriptionToBullets } from "../utils/descriptionBullets.js"

const variantClass = {
  detail: "option-description-bullets--detail",
  preview: "option-description-bullets--preview",
  compact: "option-description-bullets--compact",
}

export default function DescriptionBullets({ text, variant = "detail" }) {
  const items = descriptionToBullets(text)
  if (!items.length) return null
  const mod = variantClass[variant] ?? variantClass.detail
  return (
    <ul className={`option-description-bullets ${mod}`} role="list">
      {items.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  )
}
