
import {
  JourneyCompletionEntityLink,
  type JourneyCompletionEntityLinkProps,
} from './JourneyCompletionEntityLink';

export type JourneyCompletionJourneyLinkProps =
  JourneyCompletionEntityLinkProps;

export function JourneyCompletionJourneyLink(
  props: JourneyCompletionJourneyLinkProps,
) {
  return (
    <JourneyCompletionEntityLink
      {...props}
      prefix={props.prefix ?? 'Journey'}
    />
  );
}
