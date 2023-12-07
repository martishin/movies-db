export default interface OutletContext {
  jwtToken: string
  setJwtToken: (token: string) => void
  setAlertMessage: (message: string) => void
  setAlertClassName: (className: string) => void
}
