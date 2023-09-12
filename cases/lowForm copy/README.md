# low-form
An experiment to create the lowest impact React form API.

This library was created to be the answer to one question: What would a form with the least code overhead look like? What would a component that made HMTL forms that "just work" have to do? What's the simplest React/form API that could exist while still being sort of useful?

`low-form` is the result if playing with this idea. It is a React component which can be wrapped around form elements in order to create a working, [uncontrolled](https://reactjs.org/docs/uncontrolled-components.html) form with some simple but (hopefully) useful features:

* Validation on submission
* Extendable submission handling
* Generates [ARIA](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA) compliant labels
* Form-level and input-level error messaging
* Open to any styling

Please keep in mind, so far this is just an experiment and not necessarily intended for production use. The goal of this project was to experiment with creating the leanest API when constructing forms, not creating the most robust or performant form library.

There's some anti-patterns happening, such as directly mutating `children` and native DOM elements that may have some unintended side effects in larger applications. Additionally, with this simplified boilerplate goal in mind, a lot of things have been abstracted away from the user, and you may find that `low-form` will not meet all of your form-related needs. A few things that `low-form` *can't* do:

* onBlur checking
* Validation at onBlur and onChange
* Dynamically work with `input` or `select` elements that are not its direct children (they can be as deeply nested as needed, but need to be in the body of the `Form` component)

However if you find that your form needs are simple, or you're also interested in the pursuit of the leanest form API, then please feel free to check it out.

## Install

```
npm install low-form
```

## Quick Start

```js
import Form from 'low-form';

const SimpleForm = () => {
  const onSubmit = (data) => console.log(data);
  return (
    <Form onSubmit={onSubmit}>
      <input id="first" aria-labelledby="First Name" />
      <input id="last" aria-labelledby="Last Name" />
      <input id="email" aria-labelledby="Email Address" defaultValue="example@example.com" />
      <button type="submit">Submit</button>
    </Form>
  );
};

export default SimpleForm;
```

The HMTL output of this form looks like:
```html
<form data-testid="form" id="form" class="" autocomplete="on">
  <label id="label-form-first" for="first">
    First Name
  </label>
  <input id="first" aria-labelledby="label-form-first">
  <label id="label-form-last" for="last">
    Last Name
  </label>
  <input id="last" aria-labelledby="label-form-last">
  <label id="label-form-email" for="email">
    Email Address
  </label>
  <input id="email" aria-labelledby="label-form-email" value="example@example.com">
  <button type="submit">Submit</button>
</form>
```

Checkout a [Code Sandbox](https://codesandbox.io/s/quickstart-hd6ry?file=/src/App.js) of a styled version of this form.

In this example, `low-form` takes care of a few things for you:

* All of the form submission data is easily collected and handled with one function
* A `label` is generated and id-linked to each corresponding `input` and appended *before* each `input` as a sibling element. By default, if an `aria-labelledby` property is found on an `input` or `select`, the text provided is used as a new `label`'s text, and an id is used to link it the input from which it was generated
* Only one re-render required to complete the full transaction: The submit triggers a check of the state to determine what `onSubmit` should be provided

If you don't want or need the dynamically generated labels, then you can simply pass a `skipLabelGeneration` prop and they will be short-circuited during rendering. If you want to provide a custom class to the label elements rendered, a `labelClassName` can be provide to `Form` and it will be included on each label during rendering.

## Validation

`low-form` can also handle validation and error messaging with the help of `yup`. To get started, install `yup`:

```
npm install yup
```

Now you can construct a schema to validate the form data against. You can also include an `errorComponent` prop which will be rendered with the corresponding `yup` message, as well as the `id` of the form element for which it corresponds to. Each of these components will be appended to the DOM as a sibling element *after* the form input they correspond to.

```js
import Form from 'low-form';
import * as yup from 'yup';

const schema = yup.object().shape({
  first: yup.string().min(2, 'Must be at least two characters long'),
  last: yup.string().min(2, 'This one also needs to be two characters long'),
  email: yup.string().email('Must be a valid email'),
  age: yup.number().min(14, 'Must be 14 years or older'),
})

const ErrorMessage = ({ message }) => <p>{message}</p>;

const ValidatedForm = () => {
  const onSubmit = (data) => console.log(data);
  return (
    <Form onSubmit={onSubmit} schema={schema} errorComponent={ErrorMessage}>
      <input id="first" aria-labelledby="First Name" />
      <input id="last" aria-labelledby="Last Name" />
      <input id="age" type="number" aria-labelledby="Age" defaultValue="3" />
      {/* Can also be enforced with type="email" */}
      <input id="email" aria-labelledby="Email Address" defaultValue="Not a valid email" />
      <button type="submit">Submit</button>
    </Form>
  );
};

export default ValidatedForm;
```

Checkout a [Code Sandbox](https://codesandbox.io/s/validation-example-0mvuy?file=/src/App.js) of a styled version of this form.

With thes two props, we've gained some helpful functionality:

* All values must pass their corresponding `yup` key's validation
* Components containing our error messages will automatically render if validation for that `input` fails
* Our submission will not be fired unless all validations pass

If you want more customization over your error messages, or do not want them appended to the DOM by default, an optional `updateCallback` can be provided to gain access to the form's general state and errors. This function is invoked on each submit, and will fire regardless of validation success. It is invoked with a `formState` argument which is an object with the following keys:

* `formData` (object): All of the form data, with the `input` id as the key, and it's input `value` as the value. The same thing that `onSubmit` is invoked with.
* `submitCount` (number): The count of how many times an attempt to submit has been made since mounting.
* `isFormInvalid` (boolean): Set to true if one or more inputs failed validation on the latest submit.
* `isFormDirty` (boolean): Set to true when any field value has been changed or if a submit was attempted.
* `fieldErrors` (object): Contains all of the `yup` keys and their corresponding error message if the validation failed. If the validation was successful, the key will still exist but its value is set to `null`.

## Full Form API

The `Form` component exported from `low-form` can take the following properties along with the standard `className` and `style` properties:

| Name                  | Type              | Required | Default | Description                                                                                                                                                                                                                                              |
|-----------------------|-------------------|----------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `onSubmit`            | `function`        | Yes      | None    | The callback function that will be invoked on each *successful* form submission. It is invoked with an object where each `input`'s id is the key, and it's current `value` is the value.                                                                 |
| `updateCallback`      | `function`        | No       | None    | A callback that is invoked on *every* form submission. It is provided the full form state that `low-form` maintains, check the 'Validation' section for details.                                                                                         |
| `skipLabelGeneration` | `boolean`         | No       | `false` | By default, if an `input` or `select` have an `aria-labelledby` property, the value provided is used as the `innerText` of a new label generated that is linked via ID to the original input. You can suppress this behavior by supplying this property. |
| `labelClassName`      | `string`          | No       | None    | This value will be set as the `className` value of each `label` element generated during rendering.                                                                                                                                                      |
| `schema`              | `AnyObjectSchema` | No       | None    | A `yup` schema object that will be used to validate the form submission against. Check the 'validation' section for more information.                                                                                                                    |
| `isFormDisabled`      | `boolean`         | No       | `false` | If set to true, will disable all `button`, `select`, and `input` elements within the form.                                                                                                                                                               |
| `autoComplete`        | 'off' \| 'on'     | No       | 'on'    |  Determines if auto complete boxes will appear when a form element is selected.                                                                                                                                                                          |
| `errorComponent`      | React Component   | No       | None    | A React component that will be appended as a sibling *after* each corresponding `select` or `input` that did not pass validation. It is provided the failed input's error message as `message` and the `input`'s id as `id` as props.                    |
| `id`                  | `string`          | No       | 'form'  | Passed as the normal id for the `form` rendered. It is also used as the unique identifier for `id` and `key` values when generating elements. It should be unique between `<Form />` instances to prevent clashing.                                      |


# Contributing

All PRs are welcome. As mentioned before, this library was borne mainly out of the simple question: "What's the simplest React/form API that could exist while still being sort of useful?"

If you find yourself using it, find a bug, or think of another way to make it even more ridiculous, please feel free to contribute. Just ensure your tests and the README are updated accordingly before opening your PR.
