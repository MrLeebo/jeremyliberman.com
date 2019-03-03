---
title: "Turn your React HOCs into Providers"
description: "Providers are an easy enhancement you can make to any existing Higher Order Component (HOC) to make it even more flexible."
date: 2018-09-11
---

In React, HOCs (Higher Order Components) are a really good way to compartmentalize logic in your application so that it can be reusable. A Higher Order Component is essentially a function that returns a React Component. There are many HOCs that I use almost every day at my job, including redux-form's `reduxForm()` and redux-bee's `query()`.

Until recently, as I was working on a component that needed to be enhanced, I would usually create a new component to be responsible for the application with regard to that HOC. For example, if I have a `ProfilePage` and I wanted to add a form to it, I would create a new `ProfileForm` component that would be enhanced by `reduxForm`:

```jsx
export class ProfileForm extends React.Component {
  render() {
    return <form onSubmit={this.props.handleSubmit}>...</form>;
  }
}

export default reduxForm({ form: "profileForm" })(ProfileForm);
```

This is fine, but over time it presents a couple of drawbacks:

##### Any necessary state, props, or context of `ProfilePage` need to be passed along.

This can be tedious to do the first time, but it can be downright nightmarish if your components are tightly coupled and then requirements change or the scope of a component changes and it needs to be moved somewhere else in the component hierarchy.

##### Mounting and update `ProfileForm` may have side effects based on the behavior of the HOCs that enhance it.

A lot of HOCs define the lifecycle methods `componentDidMount`, `componentWillUnmount` and `componentDidUpdate` or they maintain their own internal `this.state`. You will usually find that you need to have strict control over how and when these components unmount, or else parts of your application will reset unintentionally.

##### Enhancing the same component with three or more HOCs causes `this.props` to become massive

If you apply several HOCs to one component, it can end up with a ton of props to sort through!

Another developer who is less familiar with the HOCs in play (or even yourself, months later!) may not understand where any given prop comes from, leaving them with a lot of potential codebases to search for answers.

##### Two HOCs could both provide a prop with the same name

HOCs tend to enhance components by passing props to them that let you interact with whatever functionality the HOC provides. If two or more HOCs give the same name to different props, you can get into trouble.

### Points taken. How do Providers fix this?

A Provider is child function component, or a component that takes a function as its `children` prop. You can express any HOC as a Provider, take for instance `redux-form`'s HOC:

```jsx
import { reduxForm } from "redux-form";

const toRenderProp = ({ children, ...rest }) => children(rest);
const FormProvider = reduxForm()(toRenderProp);
```

So how does `ProfilePage` look if we use our FormProvider now?

```jsx
class ProfilePage extends React.Component {
  render() {
    return (
      <FormProvider
        form="profile"
        initialValues={{ email: "test@example.com" }}
        onSubmit={console.log}
      >
        {formProps => <form onSubmit={formProps.handleSubmit}>...</form>}
      </FormProvider>
    );
  }
}
```

Doesn't look like much, but this is a really useful technique to have in your React toolbox. Let's compare it to the drawbacks we listed earlier:

- Since we didn't need to create a separate `ProfileForm` component, we don't need to pass any props/state/context along.
- We have precise control over how the `<FormProvider>` and the `<form>` get rendered and we can mount and unmount them independently of each other.
- Instead of polluting `this.props` with the dozens of props that `reduxForm` provides, all of that stuff is confined to the `formProps` param and `this.props` is left clean!
- Since the props are now function parameters, the calling code can name them anything it wants so it can resolve any naming collisions.

<iframe src="https://codesandbox.io/embed/n368mwry7m" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
