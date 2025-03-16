/**
 * Tags Management Page
 * 
 * Displays all tags with their weights and allows CRUD operations.
 * Tags are used for lead scoring and classification.
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { Formik, Form } from 'formik';
import AppLayout from '@/components/layout/AppLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import FormInput from '@/components/ui/FormInput';
import TagBadge from '@/components/tags/TagBadge';
import { getTags, createTag, updateTag, deleteTag } from '@/services/tagService';
import { tagValidationSchema } from '@/utils/validationSchemas';

export default function TagsPage() {
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Fetch all tags
  const { data: tags, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  });
  
  // Mutations for tag operations
  const createTagMutation = useMutation({
    mutationFn: createTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setIsFormOpen(false);
    },
  });
  
  const updateTagMutation = useMutation({
    mutationFn: (data: { id: number; tagData: any }) => 
      updateTag(data.id, data.tagData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      setIsFormOpen(false);
      setSelectedTag(null);
    },
  });
  
  const deleteTagMutation = useMutation({
    mutationFn: deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });

  // Handle form submission
  const handleSubmit = (values: any, { resetForm }: any) => {
    if (selectedTag) {
      updateTagMutation.mutate({ 
        id: selectedTag.id, 
        tagData: values 
      });
    } else {
      createTagMutation.mutate(values);
    }
    resetForm();
  };

  // Handle edit tag
  const handleEditTag = (tag: any) => {
    setSelectedTag(tag);
    setIsFormOpen(true);
  };

  // Handle delete tag
  const handleDeleteTag = (id: number) => {
    if (window.confirm('Are you sure you want to delete this tag? This will affect lead scores.')) {
      deleteTagMutation.mutate(id);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Tags</h1>
          <Button 
            icon={<FiPlus />}
            onClick={() => {
              setSelectedTag(null);
              setIsFormOpen(!isFormOpen);
            }}
          >
            {isFormOpen ? 'Cancel' : 'Add Tag'}
          </Button>
        </div>

        {/* Tag Form */}
        {isFormOpen && (
          <Card title={selectedTag ? 'Edit Tag' : 'Create New Tag'}>
            <Formik
              initialValues={{
                name: selectedTag?.name || '',
                color: selectedTag?.color || '#3b82f6',
                weight: selectedTag?.weight || 10,
              }}
              validationSchema={tagValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FormInput
                      label="Tag Name"
                      name="name"
                      type="text"
                      placeholder="Enter tag name"
                    />
                    
                    <div className="mb-4">
                      <label htmlFor="color" className="block mb-1 text-sm font-medium text-gray-700">
                        Color
                      </label>
                      <FormInput
                        label=""
                        name="color"
                        type="color"
                        className="h-10 w-full p-1 border rounded cursor-pointer"
                      />
                    </div>
                    
                    <FormInput
                      label="Weight (1-100)"
                      name="weight"
                      type="number"
                      min="1"
                      max="100"
                      helperText="Higher weight = more impact on lead score"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button
                      type="submit"
                      isLoading={isSubmitting || createTagMutation.isPending || updateTagMutation.isPending}
                    >
                      {selectedTag ? 'Update Tag' : 'Create Tag'}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Card>
        )}

        {/* Tags Display */}
        <Card title="All Tags" subtitle="Tags are used to categorize and score leads">
          {isLoading ? (
            <div className="py-10 text-center text-gray-500">Loading tags...</div>
          ) : tags?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tags.map((tag) => (
                    <tr key={tag.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <TagBadge tag={tag} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {tag.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            icon={<FiEdit2 />}
                            onClick={() => handleEditTag(tag)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<FiTrash2 />}
                            onClick={() => handleDeleteTag(tag.id)}
                            isLoading={deleteTagMutation.isPending && deleteTagMutation.variables === tag.id}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-10 text-center text-gray-500">
              <p className="mb-4">No tags found</p>
              <Button 
                onClick={() => setIsFormOpen(true)}
                icon={<FiPlus />}
              >
                Create your first tag
              </Button>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
} 