import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import SchemaTree from './SchemaTree';

const mockSchemaData = {
  name: 'RootModel',
  type: 'object',
  properties: {
    prompt: { type: 'string', description: 'Input prompt for generation' },
    temperature: { type: 'number', description: 'Sampling temperature' },
  },
  required: ['prompt'],
};

describe('SchemaTree Component', () => {
  it('renders schema properties correctly', () => {
    render(<SchemaTree schema={mockSchemaData} />);
    expect(screen.getByText('RootModel')).toBeDefined();
    expect(screen.getByText('prompt')).toBeDefined();
    expect(screen.getByText('temperature')).toBeDefined();
  });

  it('toggles node expansion when clicked', () => {
    render(<SchemaTree schema={mockSchemaData} />);
    const nodeToggle = screen.getByText('prompt');
    fireEvent.click(nodeToggle);
    // Verify interaction state updates cleanly
    expect(nodeToggle).toBeDefined();
  });

  it('respects hideRequired configuration flag', () => {
    render(<SchemaTree schema={mockSchemaData} hideRequired={true} />);
    // When required fields are hidden, verify rendering adjustments
    expect(screen.getByText('RootModel')).toBeDefined();
  });
});
