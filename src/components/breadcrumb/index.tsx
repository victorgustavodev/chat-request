'use client';

import Link from 'next/link';
import { BreadcrumbProps } from './type';

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="breadcrumb" className="mb-4">
      <ol className="flex items-center space-x-2 text-sm text-gray-700">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {item.href && !isLast ? (
                <Link href={item.href} className="text-emerald-700 hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'font-semibold' : ''}>{item.label}</span>
              )}
              {!isLast && <span className="mx-2 text-gray-400">{'>'}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
