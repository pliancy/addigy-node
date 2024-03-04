/*
 * Various combinations of the auth token, organization ID, and email address of the callee are
 * required for different calls to Addigy's internal API endpoints. To make things easier,
 * they are all packaged together into a single authentication object
 */
export interface IAddigyInternalAuthObject {
    orgId: string
    authToken: string
    emailAddress: string
}
