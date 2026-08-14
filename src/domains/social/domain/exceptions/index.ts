// src/domains/social/domain/exceptions/index.ts

export * from './traveller-profile.exception';

export * from './traveller-profile-not-found.exception';
export * from './traveller-profile-already-exists.exception';

export * from './traveller-profile-inactive.exception';
export * from './traveller-profile-suspended.exception';
export * from './traveller-profile-deactivated.exception';
export * from './traveller-profile-deleted.exception';

export * from './traveller-profile-handle-already-exists.exception';
export * from './traveller-profile-invalid-status-transition.exception';
export * from './traveller-profile-invalid-visibility.exception';

export * from './traveller-profile-preferences-already-exist.exception';
export * from './traveller-profile-preferences-not-found.exception';

export * from './traveller-profile-corridor-not-found.exception';
export * from './traveller-profile-corridor-already-exists.exception';
export * from './traveller-profile-primary-corridor-already-exists.exception';
export * from './traveller-profile-primary-corridor-not-found.exception';
export * from './traveller-profile-cannot-remove-primary-corridor.exception';
export * from './traveller-profile-corridor-limit-exceeded.exception';
