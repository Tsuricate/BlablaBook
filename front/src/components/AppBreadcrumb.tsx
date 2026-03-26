// components/AppBreadcrumb.tsx
import { Breadcrumb } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router';

export interface BreadcrumbItem {
  label?: string;
  to?: string;
}

const AppBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <Breadcrumb.Root>
    <Breadcrumb.List>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Breadcrumb.Item key={index}>
            {isLast ? (
              <Breadcrumb.CurrentLink>{item.label}</Breadcrumb.CurrentLink>
            ) : (
              <Breadcrumb.Link asChild>
                <RouterLink to={item.to ?? ''}>{item.label}</RouterLink>
              </Breadcrumb.Link>
            )}
            {!isLast && <Breadcrumb.Separator />}
          </Breadcrumb.Item>
        );
      })}
    </Breadcrumb.List>
  </Breadcrumb.Root>
);

export default AppBreadcrumb;
