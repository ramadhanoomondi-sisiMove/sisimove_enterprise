
import {
  JourneyCompletionEntityLink,
  type JourneyCompletionEntityLinkProps,
} from './JourneyCompletionEntityLink';

export type JourneyCompletionProviderLinkProps =
  JourneyCompletionEntityLinkProps;

export function JourneyCompletionProviderLink(
  props: JourneyCompletionProviderLinkProps,
) {
  return (
    <JourneyCompletionEntityLink
      {...props}
      prefix={props.prefix ?? 'Provider'}
    />
  );
}
