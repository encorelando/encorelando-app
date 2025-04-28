import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import Button from '../atoms/Button';

describe('Button', () => {
  it('renders correctly with children', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('applies primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-sunset-orange');
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('bg-transparent');
    expect(button).toHaveClass('border-white');
    
    rerender(<Button variant="gradient">Gradient</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-brand-gradient');
    
    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('border');
    
    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-white');
    expect(button).toHaveClass('hover:bg-white');
    
    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('bg-error');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('text-sm');
    
    rerender(<Button size="md">Medium</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-base');
    
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('text-lg');
  });

  it('handles fullWidth prop correctly', () => {
    const { rerender } = render(<Button>Regular Width</Button>);
    
    let button = screen.getByRole('button');
    expect(button).not.toHaveClass('w-full');
    
    rerender(<Button fullWidth>Full Width</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');
  });

  it('handles disabled state correctly', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50');
    expect(button).toHaveClass('cursor-not-allowed');
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} disabled>Click me</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('accepts custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('sets the correct button type', () => {
    const { rerender } = render(<Button>Default</Button>);
    
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
    
    rerender(<Button type="submit">Submit</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    
    rerender(<Button type="reset">Reset</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('has appropriate aria-label', () => {
    const { rerender } = render(<Button>Text Label</Button>);
    
    // When text content is a string, it's used as fallback aria-label
    let button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Text Label');
    
    // Explicit aria-label takes precedence
    rerender(<Button ariaLabel="Custom Label">Text Label</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Custom Label');
    
    // For non-text content, aria-label is required
    const nonTextContent = <span>Icon</span>;
    rerender(<Button ariaLabel="Icon Button">{nonTextContent}</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveAccessibleName('Icon Button');
  });

  it('passes mobile-first design requirements', () => {
    render(<Button>Mobile Friendly</Button>);
    
    const button = screen.getByRole('button');
    
    // Check for touch-optimized size (min height for touch targets)
    expect(button).toHaveClass('min-h-touch');
    
    // Check for appropriate padding
    expect(button).toHaveClass('px-md');
    expect(button).toHaveClass('py-xs');
  });

  it('has no accessibility violations', async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
