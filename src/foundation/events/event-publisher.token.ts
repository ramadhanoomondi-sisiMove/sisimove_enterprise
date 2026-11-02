// -----------------------------------------------------------------------------
// Foundation — Event Publisher DI Token
// -----------------------------------------------------------------------------
//
// Runtime dependency-injection token for the EventPublisher application port.
//
// The EventPublisher interface disappears at runtime because it is a
// TypeScript interface. NestJS therefore requires a runtime token.
//
// Application handlers depend on this token + EventPublisher interface.
// Infrastructure binds the token to the EventPublisher implementation.
//
// -----------------------------------------------------------------------------

export const EVENT_PUBLISHER = Symbol('EventPublisher');

export default EVENT_PUBLISHER;