const Index = () => {
  console.log("Index component is rendering");
  
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#ffffff' }}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#000000' }}>
          Marco-net Farming Test
        </h1>
        <p className="text-xl mb-4" style={{ color: '#666666' }}>
          App is now displaying! ✅
        </p>
        <div className="p-4 border rounded-lg bg-green-100">
          <p>If you can see this, the app is working correctly.</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
