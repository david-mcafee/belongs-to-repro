# belongs-to-repro

[Issue](https://github.com/aws-amplify/amplify-js/issues/10487)
[PR](https://github.com/aws-amplify/amplify-js/pull/10540)

## Schema

```graphql
input AMPLIFY {
  globalAuthRule: AuthRule = { allow: public }
} # FOR TESTING ONLY!

type Todo @model {
  id: ID!
  createdBy: User! @belongsTo
  name: String!
  description: String
}

type User @model {
  id: ID!
  todos: [Todo] @hasMany
}
```
