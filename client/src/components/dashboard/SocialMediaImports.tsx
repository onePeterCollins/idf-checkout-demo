import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { SocialIcon } from '@/components/ui/icons'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { apiRequest } from '@/lib/queryClient'

export default function SocialMediaImports() {
  const { toast } = useToast()
  const [importingPlatform, setImportingPlatform] = useState<string | null>(null)

  const importMutation = useMutation({
    mutationFn: async (platform: string) => {
      const res = await apiRequest('POST', `/api/import/${platform}`, {})
      return res.json()
    },
    onSuccess: data => {
      toast({
        title: 'Import Successful',
        description: `${data.importedCount} products imported from ${importingPlatform}`,
        variant: 'success'
      })
      setImportingPlatform(null)
    },
    onError: error => {
      toast({
        title: 'Import Failed',
        description: 'Failed to import products. Please try again.',
        variant: 'destructive'
      })
      setImportingPlatform(null)
    }
  })

  const handleImport = (platform: string) => {
    setImportingPlatform(platform)
    importMutation.mutate(platform)
  }

  const socialPlatforms = [
    {
      name: 'Facebook',
      platform: 'facebook',
      description: 'Import your Facebook shop products',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      name: 'Instagram',
      platform: 'instagram',
      description: 'Import your Instagram shop products',
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      name: 'WhatsApp',
      platform: 'whatsapp',
      description: 'Import your WhatsApp Business products',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      name: 'TikTok',
      platform: 'tiktok',
      description: 'Import your TikTok shop products',
      bgColor: 'bg-gray-100',
      iconColor: 'text-black'
    }
  ]

  return (
    <div className="mt-8">
      <h2 className="text-lg font-medium text-gray-900">Import Products from Social Media</h2>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {socialPlatforms.map(platform => (
          <div
            key={platform.name}
            className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div
                className={`mx-auto mb-3 flex items-center justify-center h-12 w-12 rounded-full ${platform.bgColor}`}>
                <SocialIcon platform={platform.platform as any} className={platform.iconColor} />
              </div>
              <h3 className="text-lg font-medium text-gray-900">{platform.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{platform.description}</p>
              <Button
                onClick={() => handleImport(platform.platform)}
                disabled={importMutation.isPending}
                className="mt-4">
                {importingPlatform === platform.platform ? 'Coming Soon...' : 'Coming Soon...'}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
