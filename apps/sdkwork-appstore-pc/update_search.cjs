const fs = require('fs');
let content = fs.readFileSync('src/pages/Search.tsx', 'utf8');

// Update input styles
content = content.replace(/className="w-full bg-white dark:bg-\[#1C1C1E\] border border-gray-200 dark:border-\[#2C2C2E\] text-\[#1C1C1E\] dark:text-\[#F5F5F5\] placeholder-gray-400 dark:placeholder-gray-500 rounded-xl py-3 pl-12 pr-10 outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"/g, 'className="w-full bg-gray-100 dark:bg-[#1C1C1E] border-none text-[#1C1C1E] dark:text-[#F5F5F5] placeholder-gray-500 dark:placeholder-gray-400 rounded-xl py-3.5 pl-12 pr-10 outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-[17px]"');

content = content.replace(/className="relative mb-6 shadow-sm rounded-xl"/g, 'className="relative mb-8 rounded-xl"');

// Update trending
content = content.replace(/<div className="flex flex-col gap-1 border-t border-gray-200 dark:border-\[#2C2C2E\] pt-3">[\s\S]*?<\/div>/, `<div className="flex flex-col">
            {trending.map((item, index) => (
              <button 
                key={item}
                onClick={() => setQuery(item)}
                className={\`text-left py-3.5 text-blue-600 dark:text-[#0A84FF] hover:bg-gray-50 dark:hover:bg-[#1C1C1E] px-2 rounded-lg transition-colors font-medium flex items-center gap-4 text-lg \${index !== trending.length - 1 ? 'border-b border-gray-100 dark:border-[#2C2C2E]' : ''}\`}
              >
                <SearchIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                {item}
              </button>
            ))}
          </div>`);

// Search results gap
content = content.replace(/className="flex flex-col gap-8 border-t border-gray-200 dark:border-\[#2C2C2E\] pt-6"/g, 'className="flex flex-col gap-10 pt-2"');

fs.writeFileSync('src/pages/Search.tsx', content);
