import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import SearchInput from '../molecules/SearchInput';
import PropTypes from 'prop-types';

// Mock the Icon component to avoid SVG rendering issues in tests
jest.mock('../atoms/Icon', () => {
  const MockIcon = ({ name }) => {
    return <span data-testid={`icon-${name}`} />;
  };

  MockIcon.propTypes = {
    name: PropTypes.string.isRequired,
  };

  return MockIcon;
});

// Mock the IconButton component
jest.mock('../atoms/IconButton', () => {
  const MockIconButton = ({ icon, onClick, ariaLabel }) => {
    return <button data-testid={`icon-button-${icon}`} onClick={onClick} aria-label={ariaLabel} />;
  };

  MockIconButton.propTypes = {
    icon: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    ariaLabel: PropTypes.string.isRequired,
  };

  return MockIconButton;
});

describe('SearchInput', () => {
  const defaultProps = {
    value: '',
    onChange: jest.fn(),
  };

  it('renders correctly with default props', () => {
    render(<SearchInput {...defaultProps} />);

    // Check the search icon
    expect(screen.getByTestId('icon-search')).toBeInTheDocument();

    // Check the input
    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search concerts, artists, venues...');

    // The clear button should not be visible when there's no value
    expect(screen.queryByTestId('icon-button-x')).not.toBeInTheDocument();
  });

  it('shows clear button when value is present', () => {
    render(<SearchInput {...defaultProps} value="test query" />);

    // The clear button should be visible
    expect(screen.getByTestId('icon-button-x')).toBeInTheDocument();
  });

  it('calls onChange when input value changes', () => {
    const handleChange = jest.fn();
    render(<SearchInput {...defaultProps} onChange={handleChange} />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'search term' } });

    expect(handleChange).toHaveBeenCalled();
  });

  it('calls onClear when clear button is clicked', () => {
    const handleClear = jest.fn();
    render(<SearchInput {...defaultProps} value="test query" onClear={handleClear} />);

    const clearButton = screen.getByTestId('icon-button-x');
    fireEvent.click(clearButton);

    expect(handleClear).toHaveBeenCalled();
  });

  it('fallbacks to onChange with empty value when onClear is not provided', () => {
    const handleChange = jest.fn();
    render(<SearchInput value="test query" onChange={handleChange} />);

    const clearButton = screen.getByTestId('icon-button-x');
    fireEvent.click(clearButton);

    expect(handleChange).toHaveBeenCalledWith({ target: { value: '' } });
  });

  it('calls onSubmit when form is submitted', () => {
    const handleSubmit = jest.fn();
    render(<SearchInput {...defaultProps} value="test query" onSubmit={handleSubmit} />);

    const form = screen.getByRole('searchbox').closest('form');
    fireEvent.submit(form);

    expect(handleSubmit).toHaveBeenCalledWith('test query');
  });

  it('applies disabled state correctly', () => {
    render(<SearchInput {...defaultProps} disabled />);

    const input = screen.getByRole('searchbox');
    expect(input).toBeDisabled();
  });

  it('accepts custom placeholder text', () => {
    const customPlaceholder = 'Search for shows...';
    render(<SearchInput {...defaultProps} placeholder={customPlaceholder} />);

    const input = screen.getByRole('searchbox');
    expect(input).toHaveAttribute('placeholder', customPlaceholder);
  });

  it('applies custom className', () => {
    const customClass = 'custom-search-input';
    render(<SearchInput {...defaultProps} className={customClass} />);

    const form = screen.getByRole('searchbox').closest('form');
    expect(form).toHaveClass(customClass);
  });

  it('meets mobile-first design requirements', () => {
    render(<SearchInput {...defaultProps} />);

    const input = screen.getByRole('searchbox');

    // Check for touch-optimized size (min height for touch targets)
    expect(input).toHaveClass('min-h-touch');

    // Check for appropriate padding
    expect(input).toHaveClass('py-xs');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<SearchInput {...defaultProps} />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
