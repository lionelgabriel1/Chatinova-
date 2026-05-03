import React from 'react';

export default function MainLayout({
  sidebar,
  collapsed = false,
  children,
  rootClassName = '',
  contentClassName = '',
  background,
}) {
  return (
    <div className={`min-h-screen ${rootClassName}`}>
      {background}
      {sidebar}
      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? 'lg:ml-16' : 'lg:ml-60'
        } ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  );
}

