Gem::Specification.new do |s|
  s.name        = 'charley.works'
  s.version     = '0.0.1'

  s.description = 'Honest Charley Bodkin'
  s.summary     = s.description

  s.homepage    = 'https://github.com/Charlex/charley.works'
  s.authors     = ['charley@bodkin.me']
  s.email       = 'charley@bodkin.me'

  s.add_dependency 'nokogiri',           '~> 1.6.0'
  s.add_dependency 'fog',                '~> 1.22.0'
  s.add_dependency 'excon',              '~> 0.33.0'
  s.add_dependency 'faraday',            '~> 0.9.0'
  s.add_dependency 'faraday_middleware', '~> 0.9.0'

  s.add_development_dependency 'rspec'

  s.files         = `git ls-files`.split($/)
  s.executables   = s.files.grep(/^bin/).map{|f| File.basename(f) }
  s.test_files    = s.files.grep(/^spec/)
  s.require_paths = ['lib']
end
