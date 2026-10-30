/**
 * One Ezoic ad spot. EzoicRouteHandler fills every `.ezoicad` on the page, and
 * Ezoic chooses the size. Keep it unstyled: a spot Ezoic leaves empty must not
 * take up space.
 */
export default function EzoicSlot() {
  return <div className="ezoicad not-prose" />
}
