/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(tabs)` | `/(tabs)/` | `/(tabs)/chatPage` | `/(tabs)/explore` | `/(tabs)/profile` | `/(tabs)/signup` | `/_sitemap` | `/chatPage` | `/components/IndividualChatView` | `/explore` | `/profile` | `/signup`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
