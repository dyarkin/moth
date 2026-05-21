export type ModuleTemplatesTreeItemBase = {
  name: string;
};

export type ModuleTemplatesDirectoryTreeItemDir =
  ModuleTemplatesTreeItemBase & {
    type: 'dir';
    children: ModuleTemplatesTreeItem[];
  };

export type ModuleTemplatesDirectoryTreeItemTemplate =
  ModuleTemplatesTreeItemBase & {
    type: 'template';
    content: string;
  };

export type ModuleTemplatesTreeItem =
  | ModuleTemplatesDirectoryTreeItemDir
  | ModuleTemplatesDirectoryTreeItemTemplate;
