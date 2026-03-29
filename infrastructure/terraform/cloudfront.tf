locals {
  cf_origin_frontend_id = "alb-frontend-origin"
  cf_origin_backend_id  = "alb-backend-origin"

  # All backend path patterns (no /api prefix — backend routes are top-level)
  backend_paths = [
    "/auth*",
    "/conversations*",
    "/knowledge*",
    "/voice*",
    "/search*",
    "/analytics*",
    "/meetings*",
    "/agents*",
    "/workflows*",
    "/admin*",
    "/health*",
    "/docs*",
    "/openapi.json*",
    "/redoc*",
  ]
}

resource "aws_cloudfront_distribution" "main" {
  enabled         = true
  http_version    = "http2"
  price_class     = "PriceClass_100" # US + Europe + Asia
  comment         = "${var.project_name} HTTPS distribution"
  is_ipv6_enabled = true

  # ── Origin 1: Frontend via ALB port 80 ──────────────────────────────────────
  origin {
    origin_id   = local.cf_origin_frontend_id
    domain_name = aws_lb.main.dns_name

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-Forwarded-Proto"
      value = "https"
    }
  }

  # ── Origin 2: Backend API via ALB port 8000 ──────────────────────────────────
  origin {
    origin_id   = local.cf_origin_backend_id
    domain_name = aws_lb.main.dns_name

    custom_origin_config {
      http_port              = 8000
      https_port             = 443
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }

    custom_header {
      name  = "X-Forwarded-Proto"
      value = "https"
    }
  }

  # ── Default behavior → Frontend ──────────────────────────────────────────────
  default_cache_behavior {
    target_origin_id       = local.cf_origin_frontend_id
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    compress               = true

    forwarded_values {
      query_string = true
      headers      = ["*"]
      cookies {
        forward = "all"
      }
    }

    # No caching for dynamic Next.js pages
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  # ── Ordered behaviors: backend API paths → Backend origin ───────────────────
  dynamic "ordered_cache_behavior" {
    for_each = local.backend_paths
    content {
      path_pattern           = ordered_cache_behavior.value
      target_origin_id       = local.cf_origin_backend_id
      viewer_protocol_policy = "redirect-to-https"
      allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
      cached_methods         = ["GET", "HEAD"]
      compress               = true

      forwarded_values {
        query_string = true
        headers      = ["*"]
        cookies {
          forward = "all"
        }
      }

      # Never cache API responses
      min_ttl     = 0
      default_ttl = 0
      max_ttl     = 0
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = {
    Name        = "${var.project_name}-cf"
    Environment = var.environment
  }
}
