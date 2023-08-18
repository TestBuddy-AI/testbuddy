import '@testing-library/jest-dom';
import { renderHook, act } from '@testing-library/react-hooks';
import { SyntheticEvent } from 'react';
import * as yup from 'yup';
import useLowForm, { UseLowFormOptions } from '../src/useLowForm';

describe('useLowForm', () => {
  const mockSubmitCallback = jest.fn();
  const mockStateCallback = jest.fn();
  const mockPreventDefault = jest.fn();
  const mockEvent = {
    preventDefault: mockPreventDefault,
  } as unknown as SyntheticEvent;

  beforeEach(() => {
    mockSubmitCallback.mockReset();
    mockStateCallback.mockReset();
    mockPreventDefault.mockReset();
  });

  const test1Error = 'must be at least twenty characters!';
  const test2Error = 'must be a number!';
  const schema = yup.object().shape({
    test1: yup.string().min(20, test1Error),
    test2: yup.number().typeError(test2Error),
  });

  const setup = (opts: Omit<UseLowFormOptions, 'submitCallback' | 'formStateCallback'> = {}) => {
    const { result, waitForNextUpdate } = renderHook(() => useLowForm({
      submitCallback: mockSubmitCallback,
      formStateCallback: mockStateCallback,
      ...opts,
    }));

    act(() => {
      result.current.registerElement('test1');
      result.current.registerElement('test2');
    });

    const submitForm = () => {
      act(() => {
        result.current.handleFormSubmit(mockEvent);
      });
    };
    return { result, waitForNextUpdate, submitForm };
  };

  it('returns the necessary functions handlers', () => {
    const { result } = setup();
    expect(typeof result.current.getFormState).toEqual('function');
    expect(typeof result.current.handleFormSubmit).toEqual('function');
    expect(typeof result.current.registerElement).toEqual('function');
  });

  it('creates a key in the form data value for each registered element', () => {
    const { submitForm } = setup();
    submitForm();
    expect(mockSubmitCallback).toHaveBeenCalledWith({ test1: '', test2: '' });
  });

  it('sets the default value or default checked attribute as the value at initialization', async () => {
    const { result, submitForm } = setup();
    act(() => {
      result.current.registerElement('test3', 'default value!');
      result.current.registerElement('test4', true);
    });
    submitForm();
    const mockSubmissionValues = mockSubmitCallback.mock.calls[0][0];
    expect(mockSubmissionValues.test3).toEqual('default value!');
    expect(mockSubmissionValues.test4).toEqual(true);
  });

  it('prevents the default submit event behavior', () => {
    const { submitForm } = setup();
    submitForm();
    expect(mockPreventDefault).toHaveBeenCalledTimes(1);
  });

  it('sets the isFormInvalid state property to true if one or more validations fail', async () => {
    const { result, submitForm, waitForNextUpdate } = setup({ schema });
    submitForm();
    await waitForNextUpdate();
    expect(result.current.getFormState().isFormInvalid).toEqual(true);
  });

  it('sets the fieldErrors key to the yup messages on failure', async () => {
    const { result, submitForm, waitForNextUpdate } = setup({ schema });
    submitForm();
    await waitForNextUpdate();
    expect(result.current.getFormState().fieldErrors).toEqual({
      test1: test1Error,
      test2: test2Error,
    });
  });
});
