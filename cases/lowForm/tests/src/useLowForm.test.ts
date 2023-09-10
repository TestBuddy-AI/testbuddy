
describe('validateForm', () => {
  it('should return an object with isFormInvalid set to false and an empty fieldErrors object when formValues is empty', async () => {
    // Arrange
    const formValues: Record<string, any> = {};
    const schema: AnyObjectSchema = {};

    // Act
    const result = await validateForm(formValues, schema);

    // Assert
    expect(result.isFormInvalid).toBe(false);
    expect(result.fieldErrors).toEqual({});
  });

  it('should return an object with isFormInvalid set to false and an empty fieldErrors object when all form values are valid', async () => {
    // Arrange
    const formValues: Record<string, any> = {
      field1: 'value1',
      field2: 'value2',
    };
    const schema: AnyObjectSchema = {};

    // Act
    const result = await validateForm(formValues, schema);

    // Assert
    expect(result.isFormInvalid).toBe(false);
    expect(result.fieldErrors).toEqual({});
  });

  it('should return an object with isFormInvalid set to true and fieldErrors containing the error message when a form value is invalid', async () => {
    // Arrange
    const formValues: Record<string, any> = {
      field1: 'invalidValue',
      field2: 'value2',
    };
    const schema: AnyObjectSchema = {
      field1: yup.string().required('Field 1 is required'),
    };

    // Act
    const result = await validateForm(formValues, schema);

    // Assert
    expect(result.isFormInvalid).toBe(true);
    expect(result.fieldErrors).toEqual({
      field1: 'Field 1 is required',
    });
  });

  it('should return an object with isFormInvalid set to true and fieldErrors containing the first error message when multiple form values are invalid', async () => {
    // Arrange
    const formValues: Record<string, any> = {
      field1: 'invalidValue',
      field2: 'invalidValue',
    };
    const schema: AnyObjectSchema = {
      field1: yup.string().required('Field 1 is required'),
      field2: yup.string().required('Field 2 is required'),
    };

    // Act
    const result = await validateForm(formValues, schema);

    // Assert
    expect(result.isFormInvalid).toBe(true);
    expect(result.fieldErrors).toEqual({
      field1: 'Field 1 is required',
    });
  });
});
 it('should return null if validation passes', async () => {
  const result = await validateField('name', 'John');
  expect(result).toBeNull();
});

it('should return the first validation error if validation fails', async () => {
  const result = await validateField('age', -10);
  expect(result).toBe('Age must be a positive number');
});

it('should return null if an error other than ValidationError occurs', async () => {
  const result = await validateField('email', 'invalid-email');
  expect(result).toBeNull();
}); 
it('should return the error at the specified field when it exists', () => {
  const field = 'email';
  const formValues = {
    email: 'test@example.com',
    password: 'password123',
  };
  const result = getErrorAtField(field, formValues);
  expect(result).toBe('Invalid email');
});

it('should return undefined when the specified field does not have an error', () => {
  const field = 'password';
  const formValues = {
    email: 'test@example.com',
    password: 'password123',
  };
  const result = getErrorAtField(field, formValues);
  expect(result).toBeUndefined();
});

it('should return undefined when the specified field does not exist in the form values', () => {
  const field = 'username';
  const formValues = {
    email: 'test@example.com',
    password: 'password123',
  };
  const result = getErrorAtField(field, formValues);
  expect(result).toBeUndefined();
});
 
describe('unit tests', () => {
  it('should return true when error is truthy', () => {
    const error = new Error('Something went wrong');
    const result = (error) => Boolean(error);
    expect(result(error)).toBe(true);
  });

  it('should return false when error is falsy', () => {
    const error = null;
    const result = (error) => Boolean(error);
    expect(result(error)).toBe(false);
  });
});
 // Unit test for the use case when the accumulator is an empty object and the current element is the first element in the array
it('should set the current element as a property in the accumulator object with the corresponding error message', () => {
  const acc = {};
  const curr = 'first';
  const index = 0;
  const errorMessages = ['Error 1', 'Error 2', 'Error 3'];
  const expected = { first: 'Error 1' };

  const result = acc[curr] = errorMessages[index];

  expect(result).toEqual(expected);
});

// Unit test for the use case when the accumulator already has properties and the current element is not the first element in the array
it('should add the current element as a property in the accumulator object with the corresponding error message', () => {
  const acc = { first: 'Error 1' };
  const curr = 'second';
  const index = 1;
  const errorMessages = ['Error 1', 'Error 2', 'Error 3'];
  const expected = { first: 'Error 1', second: 'Error 2' };

  const result = acc[curr] = errorMessages[index];

  expect(result).toEqual(expected);
});

// Unit test for the use case when the accumulator already has properties and the current element is the last element in the array
it('should add the current element as a property in the accumulator object with the corresponding error message', () => {
  const acc = { first: 'Error 1', second: 'Error 2' };
  const curr = 'third';
  const index = 2;
  const errorMessages = ['Error 1', 'Error 2', 'Error 3'];
  const expected = { first: 'Error 1', second: 'Error 2', third: 'Error 3' };

  const result = acc[curr] = errorMessages[index];

  expect(result).toEqual(expected);
}); 
const validateSubmission = async (formValues: Record<string, any>, schema: any): Promise<LowFormFormState> => {
  // implementation of validateSubmission function
};

interface UseLowFormOptions {
  submitCallback: (formValues: Record<string, any>) => void;
  formStateCallback?: (formState: LowFormFormState) => void;
  schema?: any;
  previousSubmits?: number;
}

interface LowFormFormState {
  isFormInvalid: boolean;
  isFormDirty: boolean;
  fieldErrors: Record<string, string>;
  submitCount: number;
  formData?: Record<string, any>;
}

interface UseLowFormHookReturn {
  registerElement: (key: string, defaultValue?: string | boolean) => (event: SyntheticEvent) => void;
  handleFormSubmit: (event: SyntheticEvent) => void;
  getFormState: () => LowFormFormState;
}

const useLowForm = ({
  submitCallback,
  formStateCallback,
  schema,
  previousSubmits = 0,
}: UseLowFormOptions): UseLowFormHookReturn => {
  const formValuesRef = useRef<Record<string, any>>({});
  const [formState, setFormState] = useState<LowFormFormState>({
    isFormInvalid: false,
    isFormDirty: false,
    fieldErrors: {},
    submitCount: previousSubmits,
  });

  const updateFormStateOnSubmit = useCallback(
    (errorState: Omit<LowFormFormState, 'submitCount' | 'isFormDirty'>) => {
      setFormState({
        ...errorState,
        submitCount: formState.submitCount + 1,
        isFormDirty: true,
      });
    },
    [formState]
  );

  const setFormDirty = useCallback(() => {
    setFormState({
      ...formState,
      isFormDirty: true,
    });
  }, [formState]);

  const getFormState = useCallback(() => ({ ...formState, formData: { ...formValuesRef.current } }), [formState]);

  useEffect(() => {
    if (formStateCallback && formState.submitCount > 0) {
      formStateCallback(getFormState());
    }
  }, [getFormState, formStateCallback, formState.submitCount]);

  const registerElement = (key: string, defaultValue?: string | boolean) => {
    if (typeof formValuesRef.current[key] === 'undefined') {
      formValuesRef.current[key] = defaultValue || '';
    }
    return (event: SyntheticEvent) => {
      if (!formState.isFormDirty) {
        setFormDirty();
      }
      formValuesRef.current[key] = (event.target as HTMLInputElement).value;
    };
  };

  const handleFormSubmit = useCallback(
    async (event: SyntheticEvent) => {
      event.preventDefault();
      if (schema) {
        const errorResult = await validateSubmission(formValuesRef.current, schema);
        if (errorResult.isFormInvalid) {
          updateFormStateOnSubmit(errorResult);
          return;
        }
      }
      updateFormStateOnSubmit({ isFormInvalid: false, fieldErrors: {} });
      submitCallback({ ...formValuesRef.current });
    },
    [schema, submitCallback, updateFormStateOnSubmit]
  );

  return { registerElement, handleFormSubmit, getFormState };
};

describe('useLowForm', () => {
  it('should update form state on submit when form is invalid', async () => {
    const submitCallback = jest.fn();
    const formStateCallback = jest.fn();
    const schema = { /* schema definition */ };
    const previousSubmits = 0;

    const { handleFormSubmit } = useLowForm({ submitCallback, formStateCallback, schema, previousSubmits });

    // simulate form submission with invalid data
    await handleFormSubmit({ preventDefault: jest.fn() });

    expect(formStateCallback).toHaveBeenCalledWith({
      isFormInvalid: true,
      isFormDirty: true,
      fieldErrors: { /* field errors */ },
      submitCount: 1,
      formData: { /* form data */ },
    });
    expect(submitCallback).not.toHaveBeenCalled();
  });

  it('should update form state on submit when form is valid', async () => {
    const submitCallback = jest.fn();
    const formStateCallback = jest.fn();
    const schema = { /* schema definition */ };
    const previousSubmits = 0;

    const { handleFormSubmit } = useLowForm({ submitCallback, formStateCallback, schema, previousSubmits });

    // simulate form submission with valid data
    await handleFormSubmit({ preventDefault: jest.fn() });

    expect(formStateCallback).toHaveBeenCalledWith({
      isFormInvalid: false,
      isFormDirty: true,
      fieldErrors: {},
      submitCount: 1,
      formData: { /* form data */ },
    });
    expect(submitCallback).toHaveBeenCalledWith({ /* form data */ });
  });

  it('should update form state on registerElement when form is not dirty', () => {
    const submitCallback = jest.fn();
    const formStateCallback = jest.fn();
    const schema = { /* schema definition */ };
    const previousSubmits = 0;

    const { registerElement } = useLowForm({ submitCallback, formStateCallback, schema, previousSubmits });

    // simulate registering an element with a value
    const event = { target: { value: 'test' } };
    const handleChange = registerElement('input', 'default');
    handleChange(event);

    expect(formStateCallback).not.toHaveBeenCalled();
  });

  it('should update form state on registerElement when form is dirty', () => {
    const submitCallback = jest.fn();
    const formStateCallback = jest.fn();
    const schema = { /* schema definition */ };
    const previousSubmits = 0;

    const { registerElement } = useLowForm({ submitCallback, formStateCallback, schema, previousSubmits });

    // simulate registering an element with a value
    const event = { target: { value: 'test' } };
    const handleChange = registerElement('input', 'default');
    handleChange(event);

    expect(formStateCallback).toHaveBeenCalledWith({
      isFormInvalid: false,
      isFormDirty: true,
      fieldErrors: {},
      submitCount: 0,
      formData: { /* form data */ },
    });
  });

  it('should return the current form state', () => {
    const submitCallback = jest.fn();
    const formStateCallback = jest.fn();
    const schema = { /* schema definition */ };
    const previousSubmits = 0;

    const { getFormState } = useLowForm({ submitCallback, formStateCallback, schema, previousSubmits });

    const formState = getFormState();

    expect(formState).toEqual({
      isFormInvalid: false,
      isFormDirty: false,
      fieldErrors: {},
      submitCount: 0,
      formData: {},
    });
  });
});
 it('should update form state with error state', () => {
  const errorState: Omit<LowFormFormState, 'submitCount' | 'isFormDirty'> = {
    // specify the error state properties here
  };

  const expectedFormState = {
    ...errorState,
    submitCount: formState.submitCount + 1,
    isFormDirty: true,
  };

  setFormState(expectedFormState);

  expect(formState).toEqual(expectedFormState);
}); it('should set isFormDirty to true', () => {
  const setFormState = jest.fn();
  const formState = { isFormDirty: false };

  setFormState({ ...formState, isFormDirty: true });

  expect(setFormState).toHaveBeenCalledWith({ isFormDirty: true });
}); 
it('should return a new object with formState and formData properties', () => {
  const formState = { prop1: 'value1', prop2: 'value2' };
  const formValuesRef = { current: { prop3: 'value3', prop4: 'value4' } };

  const result = () => ({ ...formState, formData: { ...formValuesRef.current } });

  expect(result()).toEqual({ prop1: 'value1', prop2: 'value2', formData: { prop3: 'value3', prop4: 'value4' } });
});

it('should return a new object with formState and an empty formData property if formValuesRef.current is empty', () => {
  const formState = { prop1: 'value1', prop2: 'value2' };
  const formValuesRef = { current: {} };

  const result = () => ({ ...formState, formData: { ...formValuesRef.current } });

  expect(result()).toEqual({ prop1: 'value1', prop2: 'value2', formData: {} });
});
 
it('should call formStateCallback if formStateCallback is defined and submitCount is greater than 0', () => {
  const formStateCallback = jest.fn();
  const formState = {
    submitCount: 1
  };
  const getFormState = jest.fn();

  // Call the function
  yourFunction(formStateCallback, formState, getFormState);

  // Expect formStateCallback to be called with the result of getFormState
  expect(formStateCallback).toHaveBeenCalledWith(getFormState());
});

it('should not call formStateCallback if formStateCallback is not defined', () => {
  const formState = {
    submitCount: 1
  };
  const getFormState = jest.fn();

  // Call the function
  yourFunction(undefined, formState, getFormState);

  // Expect formStateCallback to not have been called
  expect(formStateCallback).not.toHaveBeenCalled();
});

it('should not call formStateCallback if submitCount is not greater than 0', () => {
  const formStateCallback = jest.fn();
  const formState = {
    submitCount: 0
  };
  const getFormState = jest.fn();

  // Call the function
  yourFunction(formStateCallback, formState, getFormState);

  // Expect formStateCallback to not have been called
  expect(formStateCallback).not.toHaveBeenCalled();
});
 
it('should set default value if formValuesRef.current[key] is undefined', () => {
  const key = 'testKey';
  const defaultValue = 'defaultValue';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'testValue' } };

  const result = yourFunction(key, defaultValue)(event);

  expect(formValuesRef.current[key]).toBe(defaultValue);
});

it('should set empty string as default value if defaultValue is not provided', () => {
  const key = 'testKey';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'testValue' } };

  const result = yourFunction(key)(event);

  expect(formValuesRef.current[key]).toBe('');
});

it('should set formDirty to true if formState.isFormDirty is false', () => {
  const key = 'testKey';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'testValue' } };
  const setFormDirty = jest.fn();
  const formState = { isFormDirty: false };

  const result = yourFunction(key)(event);

  expect(setFormDirty).toHaveBeenCalled();
});

it('should set formValuesRef.current[key] to event target value', () => {
  const key = 'testKey';
  const formValuesRef = { current: {} };
  const event = { target: { value: 'testValue' } };

  const result = yourFunction(key)(event);

  expect(formValuesRef.current[key]).toBe('testValue');
});
 it('should set form dirty if form state is not dirty', () => {
  const event = { target: document.createElement('input') } as SyntheticEvent;
  const formState = { isFormDirty: false };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'exampleKey';

  const result = (event: SyntheticEvent) => {
    if (!formState.isFormDirty) {
      setFormDirty();
    }
    formValuesRef.current[key] = (event.target as HTMLInputElement).value;
  };

  result(event);

  expect(setFormDirty).toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe((event.target as HTMLInputElement).value);
});

it('should not set form dirty if form state is already dirty', () => {
  const event = { target: document.createElement('input') } as SyntheticEvent;
  const formState = { isFormDirty: true };
  const setFormDirty = jest.fn();
  const formValuesRef = { current: {} };
  const key = 'exampleKey';

  const result = (event: SyntheticEvent) => {
    if (!formState.isFormDirty) {
      setFormDirty();
    }
    formValuesRef.current[key] = (event.target as HTMLInputElement).value;
  };

  result(event);

  expect(setFormDirty).not.toHaveBeenCalled();
  expect(formValuesRef.current[key]).toBe((event.target as HTMLInputElement).value);
}); it('should prevent default event behavior', () => {
  const event = { preventDefault: jest.fn() };
  const schema = null;
  const formValuesRef = { current: {} };
  const validateSubmission = jest.fn();
  const updateFormStateOnSubmit = jest.fn();
  const submitCallback = jest.fn();

  const asyncFunction = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (schema) {
      const errorResult = await validateSubmission(formValuesRef.current, schema);
      if (errorResult.isFormInvalid) {
        updateFormStateOnSubmit(errorResult);
        return;
      }
    }
    updateFormStateOnSubmit({ isFormInvalid: false, fieldErrors: {} });
    submitCallback({ ...formValuesRef.current });
  };

  asyncFunction(event);

  expect(event.preventDefault).toHaveBeenCalled();
});

it('should update form state on submit if schema is provided and form is invalid', async () => {
  const event = { preventDefault: jest.fn() };
  const schema = {};
  const formValuesRef = { current: {} };
  const validateSubmission = jest.fn().mockResolvedValue({ isFormInvalid: true });
  const updateFormStateOnSubmit = jest.fn();
  const submitCallback = jest.fn();

  const asyncFunction = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (schema) {
      const errorResult = await validateSubmission(formValuesRef.current, schema);
      if (errorResult.isFormInvalid) {
        updateFormStateOnSubmit(errorResult);
        return;
      }
    }
    updateFormStateOnSubmit({ isFormInvalid: false, fieldErrors: {} });
    submitCallback({ ...formValuesRef.current });
  };

  await asyncFunction(event);

  expect(updateFormStateOnSubmit).toHaveBeenCalledWith({ isFormInvalid: true });
  expect(submitCallback).not.toHaveBeenCalled();
});

it('should update form state on submit if schema is provided and form is valid', async () => {
  const event = { preventDefault: jest.fn() };
  const schema = {};
  const formValuesRef = { current: {} };
  const validateSubmission = jest.fn().mockResolvedValue({ isFormInvalid: false });
  const updateFormStateOnSubmit = jest.fn();
  const submitCallback = jest.fn();

  const asyncFunction = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (schema) {
      const errorResult = await validateSubmission(formValuesRef.current, schema);
      if (errorResult.isFormInvalid) {
        updateFormStateOnSubmit(errorResult);
        return;
      }
    }
    updateFormStateOnSubmit({ isFormInvalid: false, fieldErrors: {} });
    submitCallback({ ...formValuesRef.current });
  };

  await asyncFunction(event);

  expect(updateFormStateOnSubmit).toHaveBeenCalledWith({ isFormInvalid: false, fieldErrors: {} });
  expect(submitCallback).toHaveBeenCalledWith({ ...formValuesRef.current });
});

it('should update form state on submit if schema is not provided', async () => {
  const event = { preventDefault: jest.fn() };
  const schema = null;
  const formValuesRef = { current: {} };
  const validateSubmission = jest.fn();
  const updateFormStateOnSubmit = jest.fn();
  const submitCallback = jest.fn();

  const asyncFunction = async (event: SyntheticEvent) => {
    event.preventDefault();
    if (schema) {
      const errorResult = await validateSubmission(formValuesRef.current, schema);
      if (errorResult.isFormInvalid) {
        updateFormStateOnSubmit(errorResult);
        return;
      }
    }
    updateFormStateOnSubmit({ isFormInvalid: false, fieldErrors: {} });
    submitCallback({ ...formValuesRef.current });
  };

  await asyncFunction(event);

  expect(updateFormStateOnSubmit).toHaveBeenCalledWith({ isFormInvalid: false, fieldErrors: {} });
  expect(submitCallback).toHaveBeenCalledWith({ ...formValuesRef.current });
});