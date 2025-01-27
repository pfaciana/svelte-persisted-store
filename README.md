# svelte-persisted-custom-storage

A Svelte store that persists to local storage. Supports changes across multiple tabs.

This is a fork of `joshnuss/svelte-persisted-store`. It is backwards compatible with the original package, but adds the ability to specify a custom storage option. This is similar to how the original package allows you to specify a custom serializer (like `devalue` instead of JSON). See more in the options secton below.

## Installation

```bash
npm install svelte-persisted-custom-storage
```

## Usage

Define the store:

```javascript
import { persisted } from 'svelte-persisted-store'

// First param `preferences` is the local storage key.
// Second param is the initial value.
export const preferences = persisted('preferences', {
  theme: 'dark',
  pane: '50%',
  ...
})
```

Then when you want to use the store:

```javascript
import { get } from 'svelte/store'
import { preferences } from './stores'

preferences.subscribe(...) // subscribe to changes
preferences.update(...) // update value
preferences.set(...) // set value
get(preferences) // read value
$preferences // read value with automatic subscription
```

You can also optionally set the `serializer`, `storage` and `onError` type:

```javascript
import * as devalue from 'devalue'

// third parameter is options.
export const preferences = persisted('local-storage-key', 'default-value', {
  serializer: devalue, // defaults to `JSON`
  storage: 'session', // 'session' for sessionStorage, defaults to 'local'
  syncTabs: true // choose wether to sync localStorage across tabs, default is true
  onError: (e) => {/* Do something */} // Defaults to console.error with the error object
})
```

As the library will swallow errors encountered when reading from browser storage it is possible to specify a custom function to handle the error. Should the swallowing not be desirable, it is possible to re-throw the error like the following example (not recommended):

```javascript
export const preferences = persisted('local-storage-key', 'default-value', {
  onError: (e) => {
    throw e
  }
})
```

### New! Custom Storage

```javascript
// Custom storage example
const CustomStorage = {
  setItem: function(key: string, value: string): void {
    // Your custom logic here to save/store the stringified value...
    // NOTE: value is the serializer.stringify value
  },
  getItem: function(key: string): string {
    // Your custom logic here to get/retrieve the stringified value...
    // NOTE: the returned value will be passed to the serializer.parse
    return stringifiedValue
  },
  // This a required method for the custom storage to work
  // It is a minor quirk to be compatible with the original library 
  // The name is arbitrary and can be anything, but it is best to avoid using 'local' and 'session'
  // since those are the keys used for localStorage and sessionStorage
  // You MUST define the name of the custom storage like this...
  valueOf: () => 'customKey'
}

export const preferences = persisted('local-storage-key', 'default-value', {
  storage: CustomStorage
})
```

## License

MIT
