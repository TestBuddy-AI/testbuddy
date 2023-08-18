import * as React from 'react';
import '@testing-library/jest-dom';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react';
import * as yup from 'yup';
import { LowForm, LowFormErrorComponentProps, LowFormProps } from '../src/Form';

describe('LowForm Component', () => {
  const onSubmit = jest.fn();
  const stateHandler = jest.fn();

  const SomeComponent: React.FC = ({ children }) => (
    <div>
      <div>
        {children}
      </div>
    </div>
  );

  const getInputByLabel = (label: string) => screen.getByLabelText(label) as HTMLInputElement;

  const setup = (props: Omit<LowFormProps, 'onSubmit' | 'stateHandler'> = {}) => {
    const rendered = render(
      <LowForm
        onSubmit={(data) => onSubmit(data)}
        onStateUpdate={stateHandler}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        <div>
          <input aria-label="one" id="one" />
          <input aria-label="two" id="two" />
        </div>
        <div>
          <SomeComponent>
            <input aria-label="three" id="three" />
            <input aria-label="four" id="four" />
            <input aria-labelledby="Fifth One" id="five" />
          </SomeComponent>
        </div>
        <button data-testid="submit" type="submit">Submit</button>
      </LowForm>,
    );
    return rendered;
  };

  const getForm = () => screen.getByTestId('form');

  beforeEach(() => {
    onSubmit.mockReset();
    stateHandler.mockReset();
  });

  describe('handles children', () => {
    it('renders its children', () => {
      const childText = 'I am a child!';
      render(<LowForm onSubmit={onSubmit}><p>{childText}</p></LowForm>);
      expect(screen.queryByText(childText)).toBeInTheDocument();
    });

    it('registers inputs with IDs', async () => {
      setup();
      fireEvent.change(getInputByLabel('one'), { target: { value: 'meow' } });
      fireEvent.change(getInputByLabel('two'), { target: { value: 'woof' } });
      fireEvent.change(getInputByLabel('three'), { target: { value: 'hello' } });
      fireEvent.change(getInputByLabel('four'), { target: { value: 'goodbye' } });
      fireEvent.submit(getForm());
      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          one: 'meow',
          two: 'woof',
          three: 'hello',
          four: 'goodbye',
          five: '',
        });
      });
    });
  });

  describe('disables elements', () => {
    it('disables all inputs if isDisabled is true', () => {
      setup({ isFormDisabled: true });
      const input = getInputByLabel('one');
      expect(input).toBeDisabled();
    });

    it('disables buttons if isDisabled is true', () => {
      const rendered = setup({ isFormDisabled: true });
      expect(rendered.getByTestId('submit')).toBeDisabled();
    });
  });

  describe('runs validation', () => {
    const Error: React.FC<LowFormErrorComponentProps> = ({ message }) => <div>{message}</div>;
    const schema = yup.object().shape({
      one: yup.string().required('one is required!'),
      two: yup.string().min(3, 'two must be at least three characters'),
      three: yup.string().email('three has to be an email!'),
      four: yup.number().min(10, 'four must be greater than 10'),
    });

    it('does not submit if the inputs do not pass the schema', async () => {
      setup({ schema });
      await waitFor(() => {
        fireEvent.submit(getForm());
      });
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('still fires the stateHandler even if submission is not successful', async () => {
      setup({ schema });
      await waitFor(() => {
        fireEvent.submit(getForm());
      });
      expect(onSubmit).not.toHaveBeenCalled();
      expect(stateHandler).toHaveBeenCalled();
    });

    it('renders the Error component with the correct message if an input is invalid', async () => {
      const errorMessage = 'must be fifty characters';
      setup({
        schema: yup.object().shape({ one: yup.string().min(50, errorMessage) }),
        errorComponent: Error,
      });
      fireEvent.change(getInputByLabel('one'), { target: { value: 'not fifty characters!' } });
      await waitFor(() => {
        fireEvent.submit(getForm());
      });
      expect(screen.queryByText(errorMessage)).toBeInTheDocument();
    });
  });

  describe('generates labels', () => {
    it('generates and maps labels for inputs with aria-labelledby', () => {
      const rendered = setup();
      expect(rendered.getByLabelText('Fifth One')).toBeInTheDocument();
    });

    it('does not generate labels if the skip prop is passed', () => {
      const rendered = setup({ skipLabelGeneration: true });
      expect(rendered.queryAllByLabelText('Fifth One').length).toEqual(0);
    });
  });
});
