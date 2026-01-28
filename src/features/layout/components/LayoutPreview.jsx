/**
 * LayoutPreview Component
 * Displays a preview of a single layout option
 */

import { Card } from '@/shared/components';

const LayoutPreview = ({ layout, isSelected, onSelect }) => {
  return (
    <Card
      hover
      selected={isSelected}
      onClick={() => onSelect(layout)}
      className="flex flex-col items-center"
    >
      {/* Layout Grid Preview */}
      <div className="w-full mb-4 bg-ios-gray-100 rounded-lg p-4 aspect-[4/3]">
        <div
          className="grid gap-1 h-full"
          style={{
            gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
            gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
          }}
        >
          {Array.from({ length: layout.total }).map((_, index) => (
            <div
              key={index}
              className="bg-ios-gray-300 rounded flex items-center justify-center text-xs text-gray-500"
            >
              {index + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Layout Name */}
      <Card.Title>{layout.name}</Card.Title>

      {/* Layout Description */}
      <Card.Description>{layout.description}</Card.Description>

      {/* Photo Count */}
      <div className="mt-2 text-sm text-ios-blue font-medium">
        {layout.total} {layout.total === 1 ? 'photo' : 'photos'}
      </div>
    </Card>
  );
};

export default LayoutPreview;
