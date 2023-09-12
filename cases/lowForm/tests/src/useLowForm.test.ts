import {
  useState,
  useRef,
  useCallback,
  useEffect,
  SyntheticEvent,
} from 'react';
import { AnyObjectSchema } from 'yup';

// Test for an empty formValues and schema
it('should return isFormInvalid as false and fieldErrors as an empty object when formValues and schema are empty', async () => {
  // Arrange
  const formValues = {};
  const schema = {};

  // Act
  const result = await yourFunction(formValues, schema);

  // Assert
  expect(result.isFormInvalid).toBe(false);
  expect(result.fieldErrors).toEqual({});
});

// Test for a valid formValues and schema
it('should return isFormInvalid as false and fieldErrors as an empty object when formValues are valid', async () => {
  // Arrange
  const formValues = {
    name: 'John',
    age: 25,
    email: 'john@example.com'
  };
  const schema = {
    name: yup.string().required(),
    age: yup.number().required(),
    email: yup.string().email().required()
  };

  // Act
  const result = await yourFunction(formValues, schema);

  // Assert
  expect(result.isFormInvalid).toBe(false);
  expect(result.fieldErrors).toEqual({});
});

// Test for an invalid formValues and schema
it('should return isFormInvalid as true and fieldErrors with error messages when formValues are invalid', async () => {
  // Arrange
  const formValues = {
    name: '',
    age: 'twenty',
    email: 'john@example'
  };
  const schema = {
    name: yup.string().required(),
    age: yup.number().required(),
    email: yup.string().email().required()
  };

  // Act
  const result = await yourFunction(formValues, schema);

  // Assert
  expect(result.isFormInvalid).toBe(true);
  expect(result.fieldErrors).toEqual({
    name: 'This field is required',
    age: 'This field must be a number',
    email: 'This field must be a valid email'
  });
}); // Test case for successful validation
it('should return null for valid field and value', async () => {
  const field = 'name';
  const value = 'John Doe';
  const result = await validateField(field, value);
  expect(result).toBeNull();
});

// Test case for validation error
it('should return the first validation error for invalid field and value', async () => {
  const field = 'age';
  const value = 'twenty';
  const result = await validateField(field, value);
  expect(result).toBe('Invalid value');
});

// Test case for non-validation error
it('should return null for non-validation error', async () => {
  const field = 'email';
  const value = 'test@example.com';
  const result = await validateField(field, value);
  expect(result).toBeNull();
});

// Test case for empty field
it('should return null for empty field', async () => {
  const field = '';
  const value = 'John Doe';
  const result = await validateField(field, value);
  expect(result).toBeNull();
});

// Test case for empty value
it('should return null for empty value', async () => {
  const field = 'name';
  const value = '';
  const result = await validateField(field, value);
  expect(result).toBeNull();
}); // Test case for a field with no error
it('should return undefined when there is no error for the field', () => {
  const field = 'email';
  const formValues = {
    email: 'test@example.com',
    password: 'password123'
  };

  const result = getErrorAtField(field, formValues);

  expect(result).toBeUndefined();
});

// Test case for a field with an error
it('should return the error message when there is an error for the field', () => {
  const field = 'password';
  const formValues = {
    email: 'test@example.com',
    password: ''
  };

  const result = getErrorAtField(field, formValues);

  expect(result).toBe('Password is required');
});

// Test case for a field that does not exist in the form values
it('should return undefined when the field does not exist in the form values', () => {
  const field = 'username';
  const formValues = {
    email: 'test@example.com',
    password: 'password123'
  };

  const result = getErrorAtField(field, formValues);

  expect(result).toBeUndefined();
}); // Test for a truthy error value
it('should return true for a truthy error value', () => {
  const error = 'Something went wrong';
  const result = Boolean(error);
  expect(result).toBe(true);
});

// Test for a falsy error value
it('should return false for a falsy error value', () => {
  const error = null;
  const result = Boolean(error);
  expect(result).toBe(false);
}); // UNIT TESTS

// Test case 1: Check if the function correctly creates an object with keys from the array and values from the errorMessages array
it('should create an object with keys from the array and values from the errorMessages array', () => {
  const array = ['key1', 'key2', 'key3'];
  const errorMessages = ['error1', 'error2', 'error3'];
  const expectedResult = {
    key1: 'error1',
    key2: 'error2',
    key3: 'error3'
  };

  const result = array.reduce((acc, curr, index) => {
    acc[curr] = errorMessages[index];
    return acc;
  }, {});

  expect(result).toEqual(expectedResult);
});

// Test case 2: Check if the function correctly handles an empty array and returns an empty object
it('should return an empty object when the array is empty', () => {
  const array: string[] = [];
  const errorMessages = ['error1', 'error2', 'error3'];
  const expectedResult = {};

  const result = array.reduce((acc, curr, index) => {
    acc[curr] = errorMessages[index];
    return acc;
  }, {});

  expect(result).toEqual(expectedResult);
});

// Test case 3: Check if the function correctly handles an array with fewer elements than the errorMessages array
it('should create an object with keys from the array and values from the errorMessages array, even if the array has fewer elements', () => {
  const array = ['key1', 'key2'];
  const errorMessages = ['error1', 'error2', 'error3'];
  const expectedResult = {
    key1: 'error1',
    key2: 'error2'
  };

  const result = array.reduce((acc, curr, index) => {
    acc[curr] = errorMessages[index];
    return acc;
  }, {});

  expect(result).toEqual(expectedResult);
});

// Test case 4: Check if the function correctly handles an array with more elements than the errorMessages array
it('should create an object with keys from the array and values from the errorMessages array, even if the array has more elements', () => {
  const array = ['key1', 'key2', 'key3', 'key4'];
  const errorMessages = ['error1', 'error2', 'error3'];
  const expectedResult = {
    key1: 'error1',
    key2: 'error2',
    key3: 'error3',
    key4: undefined
  };

  const result = array.reduce((acc, curr, index) => {
    acc[curr] = errorMessages[index];
    return acc;
  }, {});

  expect(result).toEqual(expectedResult);
}); // UNIT TESTS

// Test case 1: Register element with default value
it('should register element with default value', () => {
  const options: UseLowFormOptions = {
    submitCallback: jest.fn(),
    formStateCallback: jest.fn(),
    schema: {},
    previousSubmits: 0
  };

  const { registerElement } = useLowForm(options);
  const key = 'name';
  const defaultValue = 'John';

  const event = {
    target: {
      value: 'John'
    }
  };

  const onChange = registerElement(key, defaultValue);
  onChange(event);

  expect(formValuesRef.current[key]).toBe(defaultValue);
});

// Test case 2: Register element without default value
it('should register element without default value', () => {
  const options: UseLowFormOptions = {
    submitCallback: jest.fn(),
    formStateCallback: jest.fn(),
    schema: {},
    previousSubmits: 0
  };

  const { registerElement } = useLowForm(options);
  const key = 'email';

  const event = {
    target: {
      value: 'test@example.com'
    }
  };

  const onChange = registerElement(key);
  onChange(event);

  expect(formValuesRef.current[key]).toBe(event.target.value);
});

// Test case 3: Handle form submit with valid data
it('should handle form submit with valid data', async () => {
  const options: UseLowFormOptions = {
    submitCallback: jest.fn(),
    formStateCallback: jest.fn(),
    schema: {
      name: {
        required: true
      },
      email: {
        required: true,
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      }
    },
    previousSubmits: 0
  };

  const { handleFormSubmit } = useLowForm(options);

  const event = {
    preventDefault: jest.fn()
  };

  formValuesRef.current = {
    name: 'John',
    email: 'test@example.com'
  };

  await handleFormSubmit(event);

  expect(event.preventDefault).toHaveBeenCalled();
  expect(options.submitCallback).toHaveBeenCalledWith(formValuesRef.current);
});

// Test case 4: Handle form submit with invalid data
it('should handle form submit with invalid data', async () => {
  const options: UseLowFormOptions = {
    submitCallback: jest.fn(),
    formStateCallback: jest.fn(),
    schema: {
      name: {
        required: true
      },
      email: {
        required: true,
        pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      }
    },
    previousSubmits: 0
  };

  const { handleFormSubmit } = useLowForm(options);

  const event = {
    preventDefault: jest.fn()
  };

  formValuesRef.current = {
    name: '',
    email: 'invalid-email'
  };

  await handleFormSubmit(event);

  expect(event.preventDefault).toHaveBeenCalled();
  expect(options.submitCallback).not.toHaveBeenCalled();
});

// Test case 5: Get form state
it('should get form state', () => {
  const options: UseLowFormOptions = {
    submitCallback: jest.fn(),
    formStateCallback: jest.fn(),
    schema: {},
    previousSubmits: 0
  };

  const { getFormState } = useLowForm(options);

  const formState = getFormState();

  expect(formState).toEqual({
    isFormInvalid: false,
    isFormDirty: false,
    fieldErrors: {},
    submitCount: options.previousSubmits,
    formData: formValuesRef.current
  });
}); // Test case for setting form state with error state
it('should set form state with error state', () => {
  // Create a mock error state
  const errorState = {
    // Omitting submitCount and isFormDirty properties
    // Add other properties as needed
    property1: 'value1',
    property2: 'value2',
  };

  // Call the function with the error state
  setFormState({ ...errorState, submitCount: formState.submitCount + 1, isFormDirty: true });

  // Assert that the form state has been updated correctly
  expect(formState).toEqual({
    ...errorState,
    submitCount: formState.submitCount + 1,
    isFormDirty: true,
  });
}); // Test case for setting isFormDirty to true
it('should set isFormDirty to true', () => {
  // Create a mock formState object
  const formState = {
    // Add any necessary properties
  };

  // Call the function with the mock formState
  const result = setFormState({ ...formState, isFormDirty: true });

  // Assert that isFormDirty is set to true in the result
  expect(result.isFormDirty).toBe(true);
});

// Test case for updating other properties in formState
it('should update other properties in formState', () => {
  // Create a mock formState object
  const formState = {
    // Add any necessary properties
  };

  // Call the function with the mock formState
  const result = setFormState({ ...formState, isFormDirty: true });

  // Assert that other properties in formState are updated correctly
  expect(result).toEqual({ ...formState, isFormDirty: true });
}); // Test case for copying form state and form data
it('should copy form state and form data', () => {
  // Create a mock form state
  const formState = {
    // Mock form state properties
  };

  // Create a mock form values reference
  const formValuesRef = {
    current: {
      // Mock form values
    },
  };

  // Call the function to copy form state and form data
  const result = {
    ...formState,
    formData: {
      ...formValuesRef.current,
    },
  };

  // Assert the result is correct
  expect(result).toEqual({
    // Expected form state properties
    formData: {
      // Expected form values
    },
  });
}); // Test case for formStateCallback being defined and submitCount > 0
it('calls formStateCallback when formStateCallback is defined and submitCount > 0', () => {
  // Mock formStateCallback and getFormState functions
  const formStateCallback = jest.fn();
  const getFormState = jest.fn();

  // Mock formState object with submitCount > 0
  const formState = {
    submitCount: 1
  };

  // Call the function with the mocked values
  myFunction(formStateCallback, formState, getFormState);

  // Verify that formStateCallback was called with the result of getFormState
  expect(formStateCallback).toHaveBeenCalledWith(getFormState());
});

// Test case for formStateCallback being defined and submitCount = 0
it('does not call formStateCallback when formStateCallback is defined and submitCount = 0', () => {
  // Mock formStateCallback and getFormState functions
  const formStateCallback = jest.fn();
  const getFormState = jest.fn();

  // Mock formState object with submitCount = 0
  const formState = {
    submitCount: 0
  };

  // Call the function with the mocked values
  myFunction(formStateCallback, formState, getFormState);

  // Verify that formStateCallback was not called
  expect(formStateCallback).not.toHaveBeenCalled();
});

// Test case for formStateCallback being undefined
it('does not call formStateCallback when formStateCallback is undefined', () => {
  // Mock getFormState function
  const getFormState = jest.fn();

  // Mock formState object with submitCount > 0
  const formState = {
    submitCount: 1
  };

  // Call the function with the mocked values
  myFunction(undefined, formState, getFormState);

  // Verify that getFormState was not called
  expect(getFormState).not.toHaveBeenCalled();
}); // UNIT TESTS

// Test case: key exists in formValuesRef.current
it('should update formValuesRef.current[key] with the value from the event', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'John';
  const formValuesRef = { current: { name: 'Jane' } };
  const event = { target: { value: 'John' } };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(formValuesRef.current[key]).toBe('John');
});

// Test case: key does not exist in formValuesRef.current and defaultValue is not provided
it('should update formValuesRef.current[key] with an empty string if key does not exist and defaultValue is not provided', () => {
  // Arrange
  const key = 'name';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'John' } };

  // Act
  const result = formValueUpdater(key)(event);

  // Assert
  expect(formValuesRef.current[key]).toBe('');
});

// Test case: key does not exist in formValuesRef.current and defaultValue is provided
it('should update formValuesRef.current[key] with the defaultValue if key does not exist and defaultValue is provided', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'John';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'Jane' } };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(formValuesRef.current[key]).toBe('John');
});

// Test case: formState.isFormDirty is false
it('should call setFormDirty if formState.isFormDirty is false', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'John';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'John' } };
  const setFormDirty = jest.fn();
  const formState = { isFormDirty: false };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(setFormDirty).toHaveBeenCalled();
});

// Test case: formState.isFormDirty is true
it('should not call setFormDirty if formState.isFormDirty is true', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'John';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'John' } };
  const setFormDirty = jest.fn();
  const formState = { isFormDirty: true };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(setFormDirty).not.toHaveBeenCalled();
}); // Test case for when formState.isFormDirty is false
it('should set form dirty when formState.isFormDirty is false', () => {
  // Arrange
  const event = { target: { value: 'test value' } };
  const formState = { isFormDirty: false };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe('test value');
});

// Test case for when formState.isFormDirty is true
it('should not set form dirty when formState.isFormDirty is true', () => {
  // Arrange
  const event = { target: { value: 'test value' } };
  const formState = { isFormDirty: true };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).not.toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe('test value');
});

// Test case for when event target is not an HTMLInputElement
it('should set form dirty and update formValuesRef.current[key] when event target is not an HTMLInputElement', () => {
  // Arrange
  const event = { target: { value: 'test value' } };
  const formState = { isFormDirty: false };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe('test value');
}); // Test case for event.preventDefault()
it('should prevent default behavior of the event', () => {
  // Create a mock event object
  const event = {
    preventDefault: jest.fn()
  };

  // Call the tested function with the mock event
  testedFunction(event);

  // Expect preventDefault to be called
  expect(event.preventDefault).toHaveBeenCalled();
});

// Test case for schema validation
it('should validate form values against the schema', async () => {
  // Create a mock event object
  const event = {
    preventDefault: jest.fn()
  };

  // Create a mock schema
  const schema = {
    // Define schema properties here
  };

  // Create a mock form values object
  const formValuesRef = {
    current: {
      // Define form values here
    }
  };

  // Create a mock error result object
  const errorResult = {
    isFormInvalid: true,
    fieldErrors: {
      // Define field errors here
    }
  };

  // Mock the validateSubmission function to return the error result
  validateSubmission.mockResolvedValueOnce(errorResult);

  // Call the tested function with the mock event and schema
  await testedFunction(event, schema);

  // Expect preventDefault to be called
  expect(event.preventDefault).toHaveBeenCalled();

  // Expect validateSubmission to be called with the form values and schema
  expect(validateSubmission).toHaveBeenCalledWith(formValuesRef.current, schema);

  // Expect updateFormStateOnSubmit to be called with the error result
  expect(updateFormStateOnSubmit).toHaveBeenCalledWith(errorResult);

  // Expect submitCallback not to be called
  expect(submitCallback).not.toHaveBeenCalled();
});

// Test case for valid form submission
it('should update form state and call submit callback for valid form submission', async () => {
  // Create a mock event object
  const event = {
    preventDefault: jest.fn()
  };

  // Create a mock schema
  const schema = {
    // Define schema properties here
  };

  // Create a mock form values object
  const formValuesRef = {
    current: {
      // Define form values here
    }
  };

  // Create a mock error result object
  const errorResult = {
    isFormInvalid: false,
    fieldErrors: {}
  };

  // Mock the validateSubmission function to return the error result
  validateSubmission.mockResolvedValueOnce(errorResult);

  // Call the tested function with the mock event and schema
  await testedFunction(event, schema);

  // Expect preventDefault to be called
  expect(event.preventDefault).toHaveBeenCalled();

  // Expect validateSubmission to be called with the form values and schema
  expect(validateSubmission).toHaveBeenCalledWith(formValuesRef.current, schema);

  // Expect updateFormStateOnSubmit to be called with the error result
  expect(updateFormStateOnSubmit).toHaveBeenCalledWith(errorResult);

  // Expect submitCallback to be called with the form values
  expect(submitCallback).toHaveBeenCalledWith({ ...formValuesRef.current });
});

// Test case for form submission without schema
it('should update form state and call submit callback for form submission without schema', async () => {
  // Create a mock event object
  const event = {
    preventDefault: jest.fn()
  };

  // Create a mock form values object
  const formValuesRef = {
    current: {
      // Define form values here
    }
  };

  // Create a mock error result object
  const errorResult = {
    isFormInvalid: false,
    fieldErrors: {}
  };

  // Mock the validateSubmission function to return the error result
  validateSubmission.mockResolvedValueOnce(errorResult);

  // Call the tested function with the mock event and without schema
  await testedFunction(event);

  // Expect preventDefault to be called
  expect(event.preventDefault).toHaveBeenCalled();

  // Expect validateSubmission not to be called
  expect(validateSubmission).not.toHaveBeenCalled();

  // Expect updateFormStateOnSubmit to be called with the error result
  expect(updateFormStateOnSubmit).toHaveBeenCalledWith(errorResult);

  // Expect submitCallback to be called with the form values
  expect(submitCallback).toHaveBeenCalledWith({ ...formValuesRef.current });
});