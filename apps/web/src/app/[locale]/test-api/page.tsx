'use client'

import { useEffect, useState } from 'react'
import { useCategories } from '@/hooks/use-categories'
import { useCities } from '@/hooks/use-cities'

export default function TestApiPage() {
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories()
  const { data: citiesData, isLoading: citiesLoading, error: citiesError } = useCities()

  const [directApiTest, setDirectApiTest] = useState<any>(null)

  useEffect(() => {
    // Teste direto da API
    const testDirectApi = async () => {
      try {
        console.log('🧪 Testando API diretamente...')
        
        // Teste categorias
        const categoriesResponse = await fetch('https://fixelo.app/api/services/categories')
        const categoriesData = await categoriesResponse.json()
        console.log('📊 Categorias direto:', categoriesData)
        
        // Teste cidades
        const citiesResponse = await fetch('https://fixelo.app/api/locations/cities')
        const citiesData = await citiesResponse.json()
        console.log('🌍 Cidades direto:', citiesData)
        
        setDirectApiTest({
          categories: categoriesData,
          cities: citiesData
        })
      } catch (error) {
        console.error('❌ Erro no teste direto:', error)
      }
    }

    testDirectApi()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">🧪 Teste de API</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Teste via Hooks */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Via Hooks (React Query)</h2>
          
          {/* Categorias */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Categorias</h3>
            <div className="text-sm text-gray-600 mb-2">
              Loading: {categoriesLoading ? 'Sim' : 'Não'} | 
              Error: {categoriesError ? 'Sim' : 'Não'}
            </div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(categories, null, 2)}
            </pre>
          </div>
          
          {/* Cidades */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-medium mb-2">Cidades</h3>
            <div className="text-sm text-gray-600 mb-2">
              Loading: {citiesLoading ? 'Sim' : 'Não'} | 
              Error: {citiesError ? 'Sim' : 'Não'}
            </div>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
              {JSON.stringify(citiesData, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* Teste Direto */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Teste Direto (Fetch)</h2>
          
          {directApiTest ? (
            <>
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Categorias (Direto)</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(directApiTest.categories, null, 2)}
                </pre>
              </div>
              
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Cidades (Direto)</h3>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-40">
                  {JSON.stringify(directApiTest.cities, null, 2)}
                </pre>
              </div>
            </>
          ) : (
            <div className="border rounded-lg p-4">
              <p>Carregando teste direto...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Comparação */}
      <div className="mt-8 border rounded-lg p-4">
        <h2 className="text-2xl font-semibold mb-4">Comparação</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-medium mb-2">Categorias</h3>
            <p>Hook: {Array.isArray(categories) ? categories.length : 'N/A'} itens</p>
            <p>Direto: {directApiTest?.categories?.categories?.length || 'N/A'} itens</p>
          </div>
          <div>
            <h3 className="font-medium mb-2">Cidades</h3>
            <p>Hook: {Array.isArray(citiesData?.data) ? citiesData.data.length : 'N/A'} itens</p>
            <p>Direto: {Array.isArray(directApiTest?.cities?.data) ? directApiTest.cities.data.length : 'N/A'} itens</p>
          </div>
        </div>
      </div>
    </div>
  )
} 