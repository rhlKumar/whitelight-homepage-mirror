import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ResponsiveTableProps {
  htmlContent: string;
  className?: string;
}

export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({ htmlContent, className = "" }) => {
  // Parse HTML table and extract data
  const parseTable = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const table = doc.querySelector("table");

    if (!table) {
      return { headers: [], rows: [] };
    }

    // Extract headers
    const headerCells = Array.from(table.querySelectorAll("thead tr th, thead tr td"));
    const headers = headerCells.map((th) => th.textContent?.trim() || "");

    // Extract rows
    const bodyRows = Array.from(table.querySelectorAll("tbody tr"));
    const rows = bodyRows.map((tr) => {
      const cells = Array.from(tr.querySelectorAll("td, th"));
      return cells.map((td) => ({
        html: td.innerHTML,
        text: td.textContent?.trim() || "",
        className: td.className || "",
        style: td.getAttribute("style") || "",
      }));
    });

    return { headers, rows };
  };

  const { headers, rows } = parseTable(htmlContent);

  // If parsing failed, fall back to rendering raw HTML
  if (headers.length === 0 && rows.length === 0) {
    return (
      <div
        className={`prose prose-gray max-w-none dark:prose-invert overflow-x-auto ${className}`}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Desktop: Table View */}
      <div className="hidden md:block overflow-x-auto">
        <div
          className="prose prose-gray max-w-none dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>

      {/* Mobile: Card View */}
      <div className="md:hidden space-y-3">
        {rows.map((row, rowIndex) => (
          <Card key={rowIndex} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 space-y-3">
              {row.map((cell, cellIndex) => {
                if (!cell.text && !cell.html) return null;
                
                return (
                  <div key={cellIndex} className="space-y-1">
                    {headers[cellIndex] && (
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                        {headers[cellIndex]}
                      </div>
                    )}
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{ __html: cell.html }}
                    />
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        {rows.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No data available
          </div>
        )}
      </div>
    </div>
  );
};
