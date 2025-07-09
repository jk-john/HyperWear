const SizeGuidePage = () => {
  return (
    <div className="bg-dark2 font-body text-white">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <h1 className="font-display mb-6 text-center text-5xl font-bold">
          Size Guide
        </h1>
        <p className="mb-12 text-center text-lg text-white/70">
          Find your perfect fit.
        </p>

        <div className="space-y-12">
          {/* T-Shirts & Hoodies */}
          <div>
            <h2 className="font-display mb-4 text-3xl font-bold">
              T-Shirts & Hoodies (Unisex)
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/20 text-center">
                <thead className="bg-dark1">
                  <tr>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-white uppercase">
                      Size
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-white uppercase">
                      Chest (in)
                    </th>
                    <th className="px-4 py-3 text-xs font-medium tracking-wider text-white uppercase">
                      Length (in)
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-dark2 divide-y divide-white/10">
                  <tr>
                    <td>S</td>
                    <td>34-36</td>
                    <td>28</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>38-40</td>
                    <td>29</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>42-44</td>
                    <td>30</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>46-48</td>
                    <td>31</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Caps */}
          <div>
            <h2 className="font-display mb-4 text-3xl font-bold">Caps</h2>
            <p className="text-white/70">
              Our caps are one-size-fits-all with an adjustable strap to ensure
              a comfortable fit for most head sizes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeGuidePage;
