# use Google Analytics to check data after deploy as production

# type vs interface
    Here are the key differences between `type` and `interface` in TypeScript:

    ## **`type` vs `interface`**

    ### **Similarities:**
    Both can define object shapes and both work the same way for basic object definitions like your `AppState`.

    ### **Key Differences:**

    1. **Declaration Merging:**
    ```typescript
    // ✅ Interface can be merged
    interface AppState {
        isLogin: boolean
    }
    interface AppState {
        isLoaded: boolean  // Merges with above
    }
    
    // ❌ Type cannot be merged (would cause error)
    type AppState = {
        isLogin: boolean
    }
    type AppState = {  // Error: Duplicate identifier
        isLoaded: boolean
    }
    ```

    2. **Flexibility:**
    ```typescript
    // ✅ Type can use unions, intersections, primitives
    type Status = 'loading' | 'success' | 'error'
    type AppState = UserState & AdminState
    
    // ❌ Interface cannot do unions directly
    interface Status = 'loading' | 'success' | 'error'  // Error
    ```

    3. **Extending:**
    ```typescript
    // Both can extend, but syntax differs
    interface AppState extends BaseState {
        isLogin: boolean
    }
    
    type AppState = BaseState & {
        isLogin: boolean
    }
    ```

    ### **For Your Case:**
    Both work identically. Your current `type AppState` is perfectly fine. The choice is often stylistic:

    - **Use `interface`** for object shapes that might be extended by others
    - **Use `type`** for unions, intersections, or when you want to prevent merging

    **Your code works great as-is with `type`!**