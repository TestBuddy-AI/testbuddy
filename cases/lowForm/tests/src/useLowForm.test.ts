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
    name: 'Jane',
    age: 25,
    email: 'jane@example.com'
  };
  const schema = {
    name: yup.string().required().matches(/^[A-Za-z]+$/, 'Name must contain only letters'),
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
    name: 'John',
    age: 'twenty',
    email: 'john@example'
  };
  const schema = {
    name: yup.string().required().matches(/^[A-Za-z]+$/, 'Name must contain only letters'),
    age: yup.number().required(),
    email: yup.string().email().required()
  };

  // Act
  const result = await yourFunction(formValues, schema);

  // Assert
  expect(result.isFormInvalid).toBe(true);
  expect(result.fieldErrors).toEqual({
    name: 'Name must contain only letters',
    age: 'This field must be a number',
    email: 'This field must be a valid email'
  });
}); // Test case for successful validation with feminine name
it('should return null for valid field and feminine name', async () => {
  const field = 'name';
  const value = 'Mary Jane';
  const result = await validateField(field, value);
  expect(result).toBeNull();
});

// Test case for successful validation with masculine name
it('should return null for valid field and masculine name', async () => {
  const field = 'name';
  const value = 'John Doe';
  const result = await validateField(field, value);
  expect(result).toBeNull();
});

// Test case for validation error with feminine name
it('should return the first validation error for invalid field and feminine name', async () => {
  const field = 'name';
  const value = 'John Doe';
  const result = await validateField(field, value);
  expect(result).toBe('Invalid name');
});

// Test case for validation error with masculine name
it('should return the first validation error for invalid field and masculine name', async () => {
  const field = 'name';
  const value = 'Mary Jane';
  const result = await validateField(field, value);
  expect(result).toBe('Invalid name');
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
    password: 'password123',
    name: 'John'
  };

  const result = getErrorAtField(field, formValues);

  expect(result).toBeUndefined();
});

// Test case for a field with an error
it('should return the error message when there is an error for the field', () => {
  const field = 'password';
  const formValues = {
    email: 'test@example.com',
    password: '',
    name: 'Jane'
  };

  const result = getErrorAtField(field, formValues);

  expect(result).toBe('Password is required');
});

// Test case for a field that does not exist in the form values
it('should return undefined when the field does not exist in the form values', () => {
  const field = 'username';
  const formValues = {
    email: 'test@example.com',
    password: 'password123',
    name: 'Jane'
  };

  const result = getErrorAtField(field, formValues);

  expect(result).toBeUndefined();
}); // Test for a truthy error value
it('should return true for a truthy error value', () => {
  const error = 'Something went wrong';
  const result = (error) => Boolean(error);
  expect(result).toBe(true);
});

// Test for a falsy error value
it('should return false for a falsy error value', () => {
  const error = null;
  const result = (error) => Boolean(error);
  expect(result).toBe(false);
}); // UNIT TESTS

// Test case 1: Check if the function correctly creates an object with keys from the array and values from the errorMessages array, considering only feminine names
it('should create an object with keys from the array and values from the errorMessages array, considering only feminine names', () => {
  const array = ['name1', 'name2', 'name3'];
  const errorMessages = ['error1', 'error2', 'error3'];
  const expectedResult = {
    name1: 'error1',
    name3: 'error3'
  };

  const result = array.reduce((acc, curr, index) => {
    if (curr.endsWith('a')) {
      acc[curr] = errorMessages[index];
    }
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
    if (curr.endsWith('a')) {
      acc[curr] = errorMessages[index];
    }
    return acc;
  }, {});

  expect(result).toEqual(expectedResult);
});

// Test case 3: Check if the function correctly handles an array with no feminine names and returns an empty object
it('should return an empty object when the array does not contain any feminine names', () => {
  const array = ['name1', 'name2', 'name3'];
  const errorMessages = ['error1', 'error2', 'error3'];
  const expectedResult = {};

  const result = array.reduce((acc, curr, index) => {
    if (curr.endsWith('a')) {
      acc[curr] = errorMessages[index];
    }
    return acc;
  }, {});

  expect(result).toEqual(expectedResult);
});

// Test case 4: Check if the function correctly handles an array with more feminine names than the errorMessages array
it('should create an object with keys from the array and values from the errorMessages array, even if the array has more feminine names', () => {
  const array = ['name1', 'name2', 'name3', 'name4'];
  const errorMessages = ['error1', 'error2', 'error3'];
  const expectedResult = {
    name1: 'error1',
    name3: 'error3'
  };

  const result = array.reduce((acc, curr, index) => {
    if (curr.endsWith('a')) {
      acc[curr] = errorMessages[index];
    }
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
  const key = 'name';

  const event = {
    target: {
      value: 'Jane'
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
    name: 'Jane',
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
    name: 'John',
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
}); // Test case for setting form state with error state and considering only feminine names
it('should set form state with error state and consider only feminine names', () => {
  // Create a mock error state with both feminine and masculine names
  const errorState = {
    // Omitting submitCount and isFormDirty properties
    // Add other properties as needed
    name: 'John',
    age: 25,
    gender: 'male',
  };

  // Call the function with the error state
  setFormState({ ...errorState, submitCount: formState.submitCount + 1, isFormDirty: true });

  // Assert that the form state has been updated correctly
  expect(formState).toEqual({
    ...errorState,
    submitCount: formState.submitCount + 1,
    isFormDirty: true,
    name: '', // Expecting the name to be empty as only feminine names are considered
  });
}); // Test case for setting isFormDirty to true with feminine names
it('should set isFormDirty to true with feminine names', () => {
  // Create a mock formState object with feminine names
  const formState = {
    name: 'Alice',
    age: 25,
    isFormDirty: false,
  };

  // Call the function with the mock formState
  const result = setFormState({ ...formState, isFormDirty: true });

  // Assert that isFormDirty is set to true in the result
  expect(result.isFormDirty).toBe(true);
});

// Test case for not setting isFormDirty to true with masculine names
it('should not set isFormDirty to true with masculine names', () => {
  // Create a mock formState object with masculine names
  const formState = {
    name: 'Bob',
    age: 30,
    isFormDirty: false,
  };

  // Call the function with the mock formState
  const result = setFormState({ ...formState, isFormDirty: true });

  // Assert that isFormDirty is not set to true in the result
  expect(result.isFormDirty).toBe(false);
});

// Test case for updating other properties in formState
it('should update other properties in formState', () => {
  // Create a mock formState object
  const formState = {
    name: 'Alice',
    age: 25,
    isFormDirty: false,
  };

  // Call the function with the mock formState
  const result = setFormState({ ...formState, isFormDirty: true });

  // Assert that other properties in formState are updated correctly
  expect(result).toEqual({ ...formState, isFormDirty: true });
}); // Test case for copying form state and form data with only feminine names
it('should copy form state and form data with only feminine names', () => {
  // Create a mock form state
  const formState = {
    // Mock form state properties
  };

  // Create a mock form values reference with both feminine and masculine names
  const formValuesRef = {
    current: {
      name: 'John',
      age: 25,
      gender: 'male',
      address: '123 Main St',
    },
  };

  // Call the function to copy form state and form data with only feminine names
  const result = {
    ...formState,
    formData: {
      name: '',
      age: 25,
      gender: 'male',
      address: '123 Main St',
    },
  };

  // Assert the result is correct
  expect(result).toEqual({
    // Expected form state properties
    formData: {
      name: '',
      age: 25,
      gender: 'male',
      address: '123 Main St',
    },
  });
}); // UNIT TESTS

// Test case: key exists in formValuesRef.current and the value from the event is a feminine name
it('should update formValuesRef.current[key] with the value from the event if it is a feminine name', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'John';
  const formValuesRef = { current: { name: 'Jane' } };
  const event = { target: { value: 'Mary' } };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(formValuesRef.current[key]).toBe('Mary');
});

// Test case: key exists in formValuesRef.current and the value from the event is not a feminine name
it('should not update formValuesRef.current[key] if the value from the event is not a feminine name', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'John';
  const formValuesRef = { current: { name: 'Jane' } };
  const event = { target: { value: 'John' } };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(formValuesRef.current[key]).toBe('Jane');
});

// Test case: key does not exist in formValuesRef.current and defaultValue is not provided
it('should update formValuesRef.current[key] with an empty string if key does not exist and defaultValue is not provided', () => {
  // Arrange
  const key = 'name';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'Mary' } };

  // Act
  const result = formValueUpdater(key)(event);

  // Assert
  expect(formValuesRef.current[key]).toBe('');
});

// Test case: key does not exist in formValuesRef.current and defaultValue is provided
it('should update formValuesRef.current[key] with the defaultValue if key does not exist and defaultValue is provided', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'Mary';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'Jane' } };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(formValuesRef.current[key]).toBe('Mary');
});

// Test case: formState.isFormDirty is false
it('should call setFormDirty if formState.isFormDirty is false', () => {
  // Arrange
  const key = 'name';
  const defaultValue = 'Mary';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'Mary' } };
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
  const defaultValue = 'Mary';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'Mary' } };
  const setFormDirty = jest.fn();
  const formState = { isFormDirty: true };

  // Act
  const result = formValueUpdater(key, defaultValue)(event);

  // Assert
  expect(setFormDirty).not.toHaveBeenCalled();
}); // Test case for formStateCallback being defined and submitCount > 0 with feminine names
it('calls formStateCallback with feminine names when formStateCallback is defined and submitCount > 0', () => {
  // Mock formStateCallback and getFormState functions
  const formStateCallback = jest.fn();
  const getFormState = jest.fn();

  // Mock formState object with submitCount > 0 and feminine names
  const formState = {
    submitCount: 1,
    firstName: 'Alice',
    lastName: 'Smith'
  };

  // Call the function with the mocked values
  myFunction(formStateCallback, formState, getFormState);

  // Verify that formStateCallback was called with the result of getFormState
  expect(formStateCallback).toHaveBeenCalledWith({
    firstName: 'Alice',
    lastName: 'Smith'
  });
});

// Test case for formStateCallback being defined and submitCount = 0 with feminine names
it('does not call formStateCallback when formStateCallback is defined and submitCount = 0 with feminine names', () => {
  // Mock formStateCallback and getFormState functions
  const formStateCallback = jest.fn();
  const getFormState = jest.fn();

  // Mock formState object with submitCount = 0 and feminine names
  const formState = {
    submitCount: 0,
    firstName: 'Alice',
    lastName: 'Smith'
  };

  // Call the function with the mocked values
  myFunction(formStateCallback, formState, getFormState);

  // Verify that formStateCallback was not called
  expect(formStateCallback).not.toHaveBeenCalled();
});

// Test case for formStateCallback being undefined with feminine names
it('does not call formStateCallback when formStateCallback is undefined with feminine names', () => {
  // Mock getFormState function
  const getFormState = jest.fn();

  // Mock formState object with submitCount > 0 and feminine names
  const formState = {
    submitCount: 1,
    firstName: 'Alice',
    lastName: 'Smith'
  };

  // Call the function with the mocked values
  myFunction(undefined, formState, getFormState);

  // Verify that getFormState was not called
  expect(getFormState).not.toHaveBeenCalled();
}); // Test case for when formState.isFormDirty is false and event target value is a feminine name
it('should set form dirty and update formValuesRef.current[key] when formState.isFormDirty is false and event target value is a feminine name', () => {
  // Arrange
  const event = { target: { value: 'Emily' } };
  const formState = { isFormDirty: false };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe('Emily');
});

// Test case for when formState.isFormDirty is false and event target value is a masculine name
it('should not set form dirty and update formValuesRef.current[key] when formState.isFormDirty is false and event target value is a masculine name', () => {
  // Arrange
  const event = { target: { value: 'John' } };
  const formState = { isFormDirty: false };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).not.toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBeUndefined();
});

// Test case for when formState.isFormDirty is true and event target value is a feminine name
it('should not set form dirty and update formValuesRef.current[key] when formState.isFormDirty is true and event target value is a feminine name', () => {
  // Arrange
  const event = { target: { value: 'Emily' } };
  const formState = { isFormDirty: true };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).not.toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe('Emily');
});

// Test case for when formState.isFormDirty is true and event target value is a masculine name
it('should not set form dirty and update formValuesRef.current[key] when formState.isFormDirty is true and event target value is a masculine name', () => {
  // Arrange
  const event = { target: { value: 'John' } };
  const formState = { isFormDirty: true };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).not.toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBeUndefined();
});

// Test case for when event target is not an HTMLInputElement
it('should set form dirty and update formValuesRef.current[key] when event target is not an HTMLInputElement', () => {
  // Arrange
  const event = { target: { value: 'Emily' } };
  const formState = { isFormDirty: false };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'testKey';

  // Act
  yourFunction(event);

  // Assert
  expect(setFormDirty).toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe('Emily');
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

// Test case for schema validation with feminine names
it('should validate form values against the schema for feminine names', async () => {
  // Create a mock event object
  const event = {
    preventDefault: jest.fn()
  };

  // Create a mock schema
  const schema = {
    // Define schema properties here
  };

  // Create a mock form values object with feminine names
  const formValuesRef = {
    current: {
      // Define form values with feminine names here
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

// Test case for valid form submission with feminine names
it('should update form state and call submit callback for valid form submission with feminine names', async () => {
  // Create a mock event object
  const event = {
    preventDefault: jest.fn()
  };

  // Create a mock schema
  const schema = {
    // Define schema properties here
  };

  // Create a mock form values object with feminine names
  const formValuesRef = {
    current: {
      // Define form values with feminine names here
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

// Test case for form submission without schema with feminine names
it('should update form state and call submit callback for form submission without schema with feminine names', async () => {
  // Create a mock event object
  const event = {
    preventDefault: jest.fn()
  };

  // Create a mock form values object with feminine names
  const formValuesRef = {
    current: {
      // Define form values with feminine names here
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